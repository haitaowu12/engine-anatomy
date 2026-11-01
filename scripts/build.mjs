import {mkdir,cp,rm,writeFile,readFile} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});await mkdir('dist/vendor',{recursive:true});
await cp('public','dist',{recursive:true});await cp('src','dist/src',{recursive:true});
for(const f of ['three.module.js','three.core.js'])await cp(`node_modules/three/build/${f}`,`dist/vendor/${f}`);
await cp('node_modules/three/examples/jsm/controls/OrbitControls.js','dist/vendor/OrbitControls.js');
await cp('node_modules/three/LICENSE','dist/vendor/THREE-LICENSE.txt');
await cp('docs','dist/docs',{recursive:true});await writeFile('dist/.nojekyll','');
console.log('Built static Engine Anatomy in dist/');
