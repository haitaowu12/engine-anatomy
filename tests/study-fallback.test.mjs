import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {addStudyFallback} from '../scripts/study-fallback.mjs';

test('A changed builder cannot add a recovery handler without its fallback content',()=>{
 const script="<script type=\"module\">try {} catch(error) { document.querySelector('#machine-loading').textContent='The machine could not start: '+error.message; }</script>";
 assert.throws(()=>addStudyFallback('<html><head></head><body>'+script+'</body></html>','turbofan'),/startup contract changed/);
 const input='<html><head><title>Machine explanation</title></head><body><noscript>This interactive machine needs JavaScript and WebGL 2.</noscript>'+script+'</body></html>';
 const built=addStudyFallback(input,'turbofan');
 assert.match(built,/id="study-fallback"/);assert.match(built,/catch\(error\)\s*\{\s*showStudyFallback\(\);/);
});

for(const [kind,engine]of [['turboshaft','helicopter'],['turboprop','turboprop'],['turbofan','turbofan']]){
 test(`${kind}: renderer failure leaves a readable route to the matching illustrated study`,()=>{
  const html=readFileSync(new URL(`../design/realistic-engine/${kind}-study.html`,import.meta.url),'utf8');
  const handler=html.match(/function showStudyFallback\(\)\{[\s\S]*?\}\n/);
  assert(handler,'The published bundle includes its fallback handler');
  let hidden=true,focused=false,loadingRemoved=false,unavailable=false;
  const fallback={set hidden(value){hidden=value;},focus(){focused=true;}};
  const document={body:{classList:{add(value){unavailable=value==='study-unavailable';}}},querySelector(selector){return selector==='#study-fallback'?fallback:selector==='#machine-loading'?{remove(){loadingRemoved=true;}}:null;}};
  new Function('document',handler[0]+'showStudyFallback();')(document);
  assert.equal(hidden,false);assert(focused&&loadingRemoved&&unavailable);
  assert.match(html,/catch\(error\)\s*\{\s*showStudyFallback\(\);/,'Startup failure reaches the fallback');
  const url=new URL(html.match(/class="study-continue" href="([^"]+)"/)[1].replaceAll('&amp;','&'),'https://engine-anatomy.web.app/studies/'+kind+'-study.html');
  assert.equal(url.pathname,'/index.html');assert.equal(url.searchParams.get('engine'),engine);assert.equal(url.searchParams.get('render'),'schematic');assert.equal(url.searchParams.get('lesson'),'gas-path');
  assert.match(html,/<noscript><main class="study-no-script">/,'The no-script state retains a text explanation');
  assert.equal(addStudyFallback(html,kind),html,'Reapplying packaging leaves the study unchanged');
 });
}
