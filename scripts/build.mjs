import {mkdir,cp,rm,writeFile,readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
await import('./catalog.mjs');
await rm('dist',{recursive:true,force:true});await mkdir('dist/vendor',{recursive:true});
const hash=createHash('sha256');
async function files(dir){const output=[];for(const entry of (await readdir(dir,{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name))){const path=dir+'/'+entry.name;if(entry.isDirectory())output.push(...await files(path));else if(entry.isFile())output.push(path);}return output;}
for(const dir of ['public','src','docs','scripts'])for(const file of await files(dir))hash.update(file+'\0').update(await readFile(file));
for(const file of ['package.json','package-lock.json'])hash.update(file+'\0').update(await readFile(file));
const studies=['turboshaft','turboprop','turbofan'].map(kind=>kind+'-study.html');
for (const page of studies) hash.update('studies/'+page+'\0').update(await readFile('design/realistic-engine/'+page));
const version=hash.digest('hex').slice(0,12);
await cp('public','dist',{recursive:true});
await mkdir('dist/studies');
for (const page of studies) await cp('design/realistic-engine/'+page,'dist/studies/'+page);await cp('src','dist/src',{recursive:true});
for(const file of await readdir('src'))if(file.endsWith('.js')){
  const source=await readFile(`src/${file}`,'utf8');
  await writeFile(`dist/src/${file}`,source.replace(/(['"])\.\/([a-z0-9-]+\.js)\1/g,`$1./$2?v=${version}$1`));
}
for(const page of (await files('public')).filter(file=>file.endsWith('.html'))){
 const target=page.replace(/^public\//,'dist/');let html=await readFile(target,'utf8');
 html=html.replace(/(\.\/(?:src\/[a-z0-9-]+\.js|[a-z0-9-]+\.css))(?=["'])/g,`$1?v=${version}`)
  .replace(/\.\/vendor\/(three\.module|OrbitControls|SVGRenderer)\.js(?=["'])/g,'./vendor/$1.js?v=0.180.0')
  .replace('</head>',`<meta name="build" content="${version}"></head>`);
 await writeFile(target,html);
}
for(const f of ['three.module.js','three.core.js'])await cp(`node_modules/three/build/${f}`,`dist/vendor/${f}`);
await cp('node_modules/three/examples/jsm/controls/OrbitControls.js','dist/vendor/OrbitControls.js');
for(const f of ['SVGRenderer.js','Projector.js']){const text=await readFile(`node_modules/three/examples/jsm/renderers/${f}`,'utf8');await writeFile(`dist/vendor/${f}`,text.replace('../renderers/Projector.js','./Projector.js?v=0.180.0'));}
await writeFile('dist/release.json',JSON.stringify({name:'Engine Anatomy',version:JSON.parse(await readFile('package.json','utf8')).version,build:version,...(process.env.GITHUB_SHA?{sourceCommit:process.env.GITHUB_SHA}:{}),three:'0.180.0',renderers:['Colorfigures','Semantic schematic','Material engine studies'],scope:'Installed engine anatomy, aircraft context, system diagrams, synthetic running plants, three material engine studies and a separate H175 construction-toy mechanism study'},null,2)+'\n');
await cp('node_modules/three/LICENSE','dist/vendor/THREE-LICENSE.txt');
await cp('docs','dist/docs',{recursive:true});await writeFile('dist/.nojekyll','');
console.log(`Built static Engine Anatomy ${version} in dist/`);

