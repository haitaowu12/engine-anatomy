import assert from 'node:assert/strict';
import {bindH175PartNavigation} from '../src/h175-navigation.js';

// A small DOM-boundary fixture: Element.closest walks actual ancestors and
// native default actions occur after the delegated listener. The regression
// depends on a non-button ancestor's data-part, not the renderer or app timing.
class Element {
 constructor(tag,parent=null,attributes={}){this.tagName=tag.toUpperCase();this.parentElement=parent;this.attributes=attributes;this.dataset=Object.fromEntries(Object.entries(attributes).filter(([k])=>k.startsWith('data-')).map(([k,v])=>[k.slice(5),v]));this.disabled=false;}
 matches(selector){const m=selector.match(/^([a-z][a-z0-9-]*)?(?:\[([a-z][a-z0-9-]*)\])?$/i);assert.ok(m,`Unsupported fixture selector: ${selector}`);return (!m[1]||this.tagName===m[1].toUpperCase())&&(!m[2]||Object.hasOwn(this.attributes,m[2]));}
 closest(selector){for(let node=this;node;node=node.parentElement)if(node.matches(selector))return node;return null;}
}
const document=new EventTarget(),workbench=new Element('section',null,{'data-part':'covers'}),access=new Element('details',workbench),summary=new Element('summary',access);
const selected=[];let frameCalls=0;access.open=true;
const unbind=bindH175PartNavigation(document,(id,options)=>{selected.push({id,...options});frameCalls++;if(id==='covers')access.open=true;});
function click(target,defaultAction=()=>{}){const event=new Event('click',{cancelable:true});Object.defineProperty(event,'target',{value:target});document.dispatchEvent(event);if(!event.defaultPrevented)defaultAction();}

for(const tag of ['button','input','select','label','canvas'])click(new Element(tag,workbench));
assert.deepEqual(selected,[]);assert.equal(frameCalls,0,'unrelated controls must not refocus the camera');
console.log('  ✓ controls under the selected workbench do not navigate or reset the camera');

click(summary,()=>{access.open=!access.open;});assert.equal(access.open,false);
click(summary,()=>{access.open=!access.open;});assert.equal(access.open,true,'native access disclosure must reopen after closing');
assert.equal(frameCalls,0);
console.log('  ✓ native Open & inspect summary closes and reopens without navigation interference');

const coverButton=new Element('button',null,{'data-part':'covers'}),branchButton=new Element('button',workbench,{'data-part':'winch'});
click(coverButton);click(new Element('strong',new Element('span',branchButton)));
assert.deepEqual(selected,[{id:'covers',open:true},{id:'winch',open:false}]);assert.equal(frameCalls,2);
branchButton.disabled=true;click(branchButton);assert.equal(frameCalls,2);
unbind();click(coverButton);assert.equal(frameCalls,2);
console.log('  ✓ mechanism and nested branch-button clicks select once; disabled or unbound controls do not');
console.log('H175 navigation: 3 event-delegation regression checks passed.');
