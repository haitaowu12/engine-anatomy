const studies={
 turboshaft:{engine:'helicopter',name:'turboshaft',output:'A separate power turbine sends shaft power through a gearbox to the helicopter rotors.'},
 turboprop:{engine:'turboprop',name:'turboprop',output:'A separate power turbine drives the propeller through a reduction gearbox. The propeller accelerates air rearward to produce thrust.'},
 turbofan:{engine:'turbofan',name:'turbofan',output:'Two shafts connect the turbines to the compressors and fan. Some air passes through the core; the rest bypasses it. Both outgoing streams contribute to thrust.'},
};

// Keep the self-contained study useful when its renderer cannot initialize.
// Apply this after the external machine builder, so a rebuild retains the path.
export function addStudyFallback(html,kind){
 const study=studies[kind];if(!study)throw new Error('Unknown engine study: '+kind);
 if(html.includes('id="study-fallback"'))return html;
 const url=`../index.html?engine=${study.engine}&amp;render=schematic&amp;activity=walkthrough&amp;lesson=gas-path&amp;step=0&amp;component=inlet&amp;lens=gas&amp;view=installed`;
 const explanation=`<p>The compressor raises the pressure of the incoming air. Fuel burns in a continuous flow, and the hot gas expands through turbines that extract energy.</p><p>${study.output}</p>`;
 const link=`<a class="study-continue" href="${url}">Open the illustrated ${study.name} explorer →</a>`;
 const style='<style id="study-fallback-style">.study-unavailable>:not(#study-fallback):not(script):not(style){display:none!important}#study-fallback,.study-no-script{box-sizing:border-box;max-width:760px;margin:0 auto;padding:clamp(24px,6vw,64px);font:16px/1.65 system-ui,sans-serif;color:#202420;background:#f3f2ee;min-height:100vh;overflow-wrap:break-word}#study-fallback[hidden]{display:none}#study-fallback h1,.study-no-script h1{font-size:clamp(28px,5vw,42px);line-height:1.2;margin:16px 0 24px}#study-fallback p,.study-no-script p{margin:16px 0}.study-continue{display:inline-block;min-height:44px;padding:12px 16px;margin:12px 0;color:#202420;border:1px solid #626b60;border-radius:4px;text-underline-offset:4px}.study-continue:focus-visible{outline:3px solid #ad4527;outline-offset:4px}.study-no-script{position:fixed;inset:0;max-width:none;z-index:1000;overflow:auto}</style>';
 const fallback=`<main id="study-fallback" hidden tabindex="-1" aria-labelledby="study-fallback-title"><p>Engine Anatomy</p><h1 id="study-fallback-title">Explore a ${study.name} engine</h1><p>The 3D view is unavailable in this browser. Continue with the illustrated explorer and its step-by-step explanations.</p>${explanation}${link}</main>`;
 const noScript=`<noscript><main class="study-no-script"><h1>How a ${study.name} works</h1>${explanation}<p>Enable JavaScript to use the interactive explorer. The illustrated view works without WebGL.</p>${link}</main></noscript>`;
 const handler=`function showStudyFallback(){const fallback=document.querySelector('#study-fallback');document.body.classList.add('study-unavailable');fallback.hidden=false;document.querySelector('#machine-loading')?.remove();fallback.focus();}\n`;
 const start='<script type="module">try {';
 const insertion='<noscript>This interactive machine needs JavaScript and WebGL 2.</noscript>';
 const failed="document.querySelector('#machine-loading').textContent='The machine could not start: '+error.message;";
 if(!html.includes(start)||!html.includes(failed)||!html.includes(insertion))throw new Error('Study builder startup contract changed: '+kind);
 return html.replace('<title>Machine explanation</title>',`<title>${study.name[0].toUpperCase()+study.name.slice(1)} engine study | Engine Anatomy</title>`)
  .replace('</head>',style+'</head>')
  .replace(insertion,fallback+noScript)
  .replace(start,'<script type="module">'+handler+'try {')
  .replace(failed,'showStudyFallback();');
}
