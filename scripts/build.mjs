import {mkdir,cp,rm,writeFile,readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
await import('./catalog.mjs');
await rm('dist',{recursive:true,force:true});await mkdir('dist/vendor',{recursive:true});
const hash=createHash('sha256');
async function files(dir){const output=[];for(const entry of (await readdir(dir,{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name))){const path=dir+'/'+entry.name;if(entry.isDirectory())output.push(...await files(path));else if(entry.isFile())output.push(path);}return output;}
for(const dir of ['public','src','docs','scripts'])for(const file of await files(dir))hash.update(file+'\0').update(await readFile(file));
for(const file of ['package.json','package-lock.json'])hash.update(file+'\0').update(await readFile(file));
const version=hash.digest('hex').slice(0,12);
await cp('public','dist',{recursive:true});await cp('src','dist/src',{recursive:true});
for(const file of await readdir('src'))if(file.endsWith('.js')){
  const source=await readFile(`src/${file}`,'utf8');
  await writeFile(`dist/src/${file}`,source.replace(/(['"])\.\/([a-z-]+\.js)\1/g,`$1./$2?v=${version}$1`));
}
let html=await readFile('dist/index.html','utf8');
html=html.replace('./src/app.js',`./src/app.js?v=${version}`).replace('./style.css',`./style.css?v=${version}`)
 .replace('./vendor/three.module.js','./vendor/three.module.js?v=0.180.0').replace('./vendor/OrbitControls.js','./vendor/OrbitControls.js?v=0.180.0').replace('./vendor/SVGRenderer.js','./vendor/SVGRenderer.js?v=0.180.0')
 .replace('</head>',`<meta name="build" content="${version}"></head>`);
await writeFile('dist/index.html',html);
for(const f of ['three.module.js','three.core.js'])await cp(`node_modules/three/build/${f}`,`dist/vendor/${f}`);
await cp('node_modules/three/examples/jsm/controls/OrbitControls.js','dist/vendor/OrbitControls.js');
for(const f of ['SVGRenderer.js','Projector.js']){const text=await readFile(`node_modules/three/examples/jsm/renderers/${f}`,'utf8');await writeFile(`dist/vendor/${f}`,text.replace('../renderers/Projector.js','./Projector.js?v=0.180.0'));}
await writeFile('dist/release.json',JSON.stringify({name:'Engine Anatomy',version:JSON.parse(await readFile('package.json','utf8')).version,build:version,baseCommit:'84752068db01034c61a4be5133fc8764c8018fab',three:'0.180.0',renderers:['WebGL','SVG geometry','Semantic schematic'],scope:'Installed engine anatomy, declared aircraft context, system diagrams and synthetic running plants'},null,2)+'\n');
await cp('node_modules/three/LICENSE','dist/vendor/THREE-LICENSE.txt');
await cp('docs','dist/docs',{recursive:true});await writeFile('dist/.nojekyll','');
console.log(`Built static Engine Anatomy ${version} in dist/`);

