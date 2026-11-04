import {DT, initialPlant, observePlant, plantDefaults, stepPlant} from '../../../src/plants.js';

export const trialSeconds = 24;

// A change in controls starts a fresh trial at the same settled operating point.
// Fixed-time samples keep seeking and captured frames independent of playback.
export function prepareTrial(kind, initial, inputs) {
  const stepsPerSample = 4;
  const samplesPerSecond = 1 / (DT * stepsPerSample);
  const states = [initial];
  for (let i = 1; i <= trialSeconds * samplesPerSecond; i++) {
    let state = states[i - 1];
    for (let j = 0; j < stepsPerSample; j++) state = stepPlant(kind, state, inputs);
    states.push(state);
  }
  return time => {
    const tick = Math.min(Math.max(0, time), trialSeconds) * samplesPerSecond;
    const state = states[Math.floor(tick)];
    const dt = (tick - Math.floor(tick)) / samplesPerSecond;
    return {state, data: observePlant(kind, state, inputs), angleG: state.angleG + state.wg * dt, angleP: state.angleP + state.wp * dt};
  };
}

export function operatingControls(lab, kind, animate) {
  const initial = initialPlant(kind);
  const inputs = plantDefaults(kind);
  let sample = prepareTrial(kind, initial, inputs);
  const isFan = kind === 'turbofan';
  const isProp = kind === 'turboprop';
  const demandLabel = isFan ? 'Thrust request' : isProp ? 'Shaft torque request' : 'Equivalent rotor load';

  function configure(id, label, key, min, max) {
    lab.slider({
      id, label, min, max, step: 1, value: inputs[key] * 100, unit: '%',
      onInput(value) {
        inputs[key] = value / 100;
        sample = prepareTrial(kind, initial, inputs);
        lab.time = 0;
      }
    });
  }

  configure('demand', demandLabel, 'demand', 20, 75);
  configure('fuel', 'Fuel ceiling', 'fuelLimit', 55, 100);
  const seek = lab.slider({
    id: 'trial-time', label: 'Trial time', min: 0, max: trialSeconds,
    step: .1, digits: 1, value: 0, unit: 's',
    onInput: value => {
      lab.time = value;
      lab.toggle('run', true);
    }
  });
  const restart = document.createElement('button');
  restart.type = 'button';
  restart.textContent = 'Restart trial';
  restart.addEventListener('click', () => {
    lab.time = 0;
    lab.toggle('run', true);
  });
  const restartRow = document.createElement('div');
  restartRow.className = 'machine-subsystems on';
  restartRow.appendChild(restart);
  seek.wrap.after(restartRow);
  function syncSeek(value) {
    seek.value = value;
    seek.el.value = value;
    seek.wrap.querySelector('b').textContent = value.toFixed(1) + ' s';
    seek.el.style.setProperty('--p', `${value / trialSeconds * 100}%`);
  }

  lab.hero({label: isFan ? 'Modeled thrust' : 'Modeled shaft power', unit: isFan ? 'kN' : 'kW', max: isFan ? 4 : 330, digits: isFan ? 2 : 0});
  lab.onFrame(time => {
    const {data, angleG, angleP} = sample(time);
    if (time >= trialSeconds && !lab.paused) lab.toggle('run', true);
    const displayTime = Math.min(trialSeconds, Math.round(time * 10) / 10);
    if (seek.value !== displayTime) syncSeek(displayTime);
    animate({data, angleG, angleP});
    const speeds = isFan ? ['N2', 'N1'] : ['Ng', 'Np'];
    const speedText = `${speeds[0]} ${Math.round(data.ng * 100)}% · ${speeds[1]} ${Math.round(data.np * 100)}%`;
    const detail = isProp ? ` · Blade angle ${data.bladeAngle.toFixed(1)}°` : '';
    lab.setHero((isFan ? data.thrust : data.outputW) / 1000, {
      state: data.limit === 'None' ? 'Educational running model' : data.limit,
      sub: speedText + detail
    });
  });
}

export function inspectionControls(lab, separation) {
  const slider = lab.slider({
    id: 'separation', label: 'Assembly separation', min: 0, max: 100,
    value: 0, step: 1, unit: '%', ends: ['Assembled', 'Separated'],
    onInput(value) {
      lab.target.explode = value / 100;
      lab._syncButtons();
    }
  });
  lab.ui.querySelector('.lab-ctls').prepend(slider.wrap);
  lab.onTick(() => {
    const value = Math.round(lab.target.explode * 100);
    if (slider.value !== value) slider.set(value);
    separation(lab.state.explode);
  });
  if (lab.q.get('mode') === 'cut') lab.target.cut = 1;
  if (lab.q.get('mode') === 'explode') lab.target.explode = 1;
  const position = lab.q.get('separation');
  if (position !== null && Number.isFinite(Number(position))) {
    lab.target.explode = Math.min(1, Math.max(0, Number(position) / 100));
  }
}


export function moduleInspector(lab) {
  const modules=lab.parts.filter(part=>part.obj.parent===lab.machine);
  const field=document.createElement('label');
  field.className='machine-quality on';
  field.textContent='Inspect module';
  const select=document.createElement('select');
  select.dataset.moduleInspector='';
  select.append(new Option('All modules',''));
  modules.forEach((part,index)=>select.append(new Option(part.name,String(index))));
  field.append(select);
  lab.ui.querySelector('.lab-ctls').append(field);
  select.addEventListener('input',()=>{
    const part=select.value==='' ? null : modules[Number(select.value)];
    lab._selection=part ? new Set([part.obj]) : null;
  });
}

export function studyNavigation(lab, active) {
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width:760px) {
      .lab-stage { position:sticky; top:0; z-index:10; height:36svh; min-height:234px; }
      .lab-side :is(button,input,select,a,summary) { scroll-margin-top:38svh; }
    }
  `;
  document.head.appendChild(style);
  const names = [['turboshaft','Turboshaft'],['turboprop','Turboprop'],['turbofan','Turbofan']];
  const nav = document.createElement('nav');
  nav.className = 'machine-credit';
  nav.setAttribute('aria-label','Engine studies');
  if (location.pathname.includes('/studies/')) {
    const home=document.createElement('a');
    home.textContent='Engine Anatomy';
    home.href='../';
    nav.append(home,' · ');
  }
  names.forEach(([id,label],index) => {
    if (index) nav.append(' · ');
    const link = document.createElement('a');
    link.textContent = label;
    link.href = id + '-study.html';
    if (id === active) {
      link.setAttribute('aria-current','page');
      link.style.fontWeight = '700';
    }
    nav.append(link);
  });
  lab.ui.querySelector('.lab-title').before(nav);
}
