// Only explicit mechanism buttons navigate. The workbench also carries data-part
// as observable state, so matching that attribute on arbitrary ancestors would
// turn control clicks into navigation and interfere with native details toggles.
export function bindH175PartNavigation(root,onSelect){
 const click=event=>{
  const button=event.target?.closest?.('button[data-part]');
  if(button&&!button.disabled)onSelect(button.dataset.part,{open:button.dataset.part==='covers'});
 };
 root.addEventListener('click',click);
 return ()=>root.removeEventListener('click',click);
}
