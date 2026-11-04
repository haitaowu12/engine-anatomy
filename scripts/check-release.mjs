import {readFile,readdir,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve,dirname} from 'node:path';
import assert from 'node:assert/strict';
const pkg=JSON.parse(await readFile('package.json','utf8')),release=JSON.parse(await readFile('dist/release.json','utf8')),html=await readFile('dist/index.html','utf8');
assert.equal(release.version,pkg.version);assert.match(release.build,/^[a-f0-9]{12}$/);assert.ok(html.includes(`<meta name="build" content="${release.build}">`));
async function files(dir){const out=[];for(const entry of (await readdir(dir,{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name))){const path=dir+'/'+entry.name;if(entry.isDirectory())out.push(...await files(path));else if(entry.isFile())out.push(path);}return out;}
const hash=createHash('sha256');for(const dir of ['public','src','docs','scripts'])for(const file of await files(dir))hash.update(file+'\0').update(await readFile(file));for(const file of ['package.json','package-lock.json'])hash.update(file+'\0').update(await readFile(file));for (const kind of ['turboshaft','turboprop','turbofan']) {
 const page=kind+'-study.html', source=await readFile('design/realistic-engine/'+page);
 hash.update('studies/'+page+'\0').update(source);
 assert.deepEqual(await readFile('dist/studies/'+page),source,'release must include the complete offline '+kind+' study');
}
assert.equal(hash.digest('hex').slice(0,12),release.build,'build identifies current source, assets, nested evidence and dependencies');
let checked=0;async function exists(owner,reference){if(!reference||reference.startsWith('#')||/^[a-z][a-z0-9+.-]*:/i.test(reference))return;assert.ok(!reference.startsWith('/'),'local references must work under a GitHub Pages project path: '+reference);const relative=reference.split(/[?#]/)[0],path=resolve(dirname(owner),relative,relative.endsWith('/')?'index.html':'');assert.ok(path.startsWith(resolve('dist')+'/'),'local reference cannot escape release');assert.ok((await stat(path)).isFile(),owner+' -> '+reference);checked++;}
const pages=(await files('public')).filter(file=>file.endsWith('.html'));
for(const page of pages){
 const target=page.replace(/^public\//,'dist/'),markup=await readFile(target,'utf8');
 assert.ok(markup.includes(`<meta name="build" content="${release.build}">`),target+' must identify the same build');
 for(const match of markup.matchAll(/(?:src|href)="([^"]+)"/g))await exists(target,match[1]);
 const mapped=markup.match(/<script type="importmap">([\s\S]*?)<\/script>/);
 if(mapped)for(const value of Object.values(JSON.parse(mapped[1]).imports)){assert.ok(value.endsWith('?v='+release.three));await exists(target,value);}
 const ids=[...markup.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);assert.equal(new Set(ids).size,ids.length,target+' contains duplicate IDs');
}
for(const file of (await files('dist/src')).filter(f=>f.endsWith('.js'))){const source=await readFile(file,'utf8');for(const match of source.matchAll(/(?:from\s*|import\s*\()(['"])(\.\/?[^'"]+)\1/g)){assert.ok(match[2].endsWith('?v='+release.build),file+' has an inconsistent local module version');await exists(file,match[2]);}}
for(const style of (await files('public')).filter(file=>file.endsWith('.css'))){const target=style.replace(/^public\//,'dist/');for(const match of (await readFile(target,'utf8')).matchAll(/url\(['"]?([^'"\)]+)['"]?\)/g))await exists(target,match[1]);}
for(const file of await files('docs'))assert.deepEqual(await readFile(file),await readFile('dist/'+file),'nested documentation/evidence must be copied exactly');
for(const id of ['canvas-host','diagram-host','cutaway','component-prev','component-next','inspection-recipe'])assert.equal([...html.matchAll(new RegExp('id="'+id+'"','g'))].length,1,id+' must have one actual control/host');
console.log(`Verified Engine Anatomy ${release.version} / ${release.build}: ${pages.length + 3} pages, ${checked} local dependency references, nested documentation parity and unique controls.`);
