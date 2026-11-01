import {mkdir,cp,rm,writeFile,readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
await import('./catalog.mjs');
await rm('dist',{recursive:true,force:true});await mkdir('dist/vendor',{recursive:true});
const hash=createHash('sha256');
for(const dir of ['public','src','docs','scripts'])for(const file of (await readdir(dir)).sort())hash.update(`${dir}/${file}\0`).update(await readFile(`${dir}/${file}`));
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
await writeFile('dist/release.json',JSON.stringify({name:'Engine Anatomy',version:'3.0.0',build:version,baseCommit:'a7640c6cd5bd167188d658a13cbfc8b1dd65934c',three:'0.180.0',renderers:['WebGL','SVG geometry','Semantic schematic'],scope:'Original generic anatomy and synthetic running plants'},null,2)+'\n');
await cp('node_modules/three/LICENSE','dist/vendor/THREE-LICENSE.txt');
await cp('docs','dist/docs',{recursive:true});await writeFile('dist/.nojekyll','');
console.log(`Built static Engine Anatomy ${version} in dist/`);

