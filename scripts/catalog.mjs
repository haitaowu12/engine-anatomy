import {writeFile} from 'node:fs/promises';
import {buildManifest,GROUPS,SOURCES} from '../src/manifest.js';
let text='# Engine components and connections\n\nFollow each component through the three engine examples. The tables identify its assembly, the quantities it receives or sends, and its source. Calculated responses, prescribed inputs and anatomy explanations are labeled so you can connect the displayed readings with the hardware.\n\n';
for(const kind of ['helicopter','turboprop','turbofan']){const m=buildManifest(kind);text+=`## ${kind}\n\n### Component concepts and instances\n\n| Component | Stable concept | Architecture instance | Parent component / system | Inspection recipe |\n|---|---|---|---|---|\n`;for(const n of m.nodes)text+=`| ${n.name} | ${n.concept} | ${n.instance} | ${n.parentNodeId||'Root / '+n.assembly} | ${n.recipe} |\n`;text+='\n';
 for(const group of ['control','service']){text+=`### ${GROUPS.find(g=>g[0]===group)[1]}\n\n| Interface | Quantity / units | Origin → destination | Role | Nature and scope | Public basis |\n|---|---|---|---|---|---|\n`;
  for(const n of m.nodes.filter(n=>n.group===group)){const src=SOURCES[n.source],name=id=>m.nodes.find(n=>n.id===id)?.name||id;const paths=m.edges.filter(e=>e.from===n.id||e.to===n.id).map(e=>`${name(e.from)} → ${name(e.to)} (${e.type}; ${e.simulated?'simulated':'explained'})`).join('<br>');const clean=v=>String(v||'—').replaceAll('|','/').replaceAll('\n',' ');
   text+=`| ${n.name} | ${clean(n.quantity)} ${n.units?' / '+n.units:''} | ${clean(paths)} | ${clean(n.role)} | ${clean(n.nature)}; ${clean(n.fidelity)} | [${src.title}](${src.url}) |\n`;
  }text+='\n';
 }
}
text+='## Reading the signals\n\nNg/Np and N1/N2 are model-specific shaft labels; pre-reduction speed and post-reduction rotor/prop speed are different quantities. Temperature labels identify the physical plane. Calculated T4 is not measured EGT/ITT. Pressure entries are total quantities. Fuel flow is an actuator state; equivalent FMU position is an inference. Oil, vibration and chip-monitoring entries explain their hardware and information paths. Variable geometry, bleed arrangements and control-channel behavior depend on the installation.\n';
await writeFile('docs/INTERFACES.md',text);console.log('Wrote source-backed interface catalog.');

