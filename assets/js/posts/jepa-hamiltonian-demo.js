/* Analytic teaching examples only; no learned encoder or Hamiltonian weights. */
(() => {
  'use strict';
  const TAU = 2 * Math.PI;
  const fixed = x => (Math.abs(x) < .00005 ? 0 : x).toFixed(4);
  const line = (x1,y1,x2,y2,style='') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${style}/>`;
  const circle = (x,y,r,style='') => `<circle cx="${x}" cy="${y}" r="${r}" ${style}/>`;
  for (const root of document.querySelectorAll('[data-jepa-demo]')) {
    const el = name => root.querySelector(`[data-jepa-${name}]`);
    let stage = 'encoder', timer=null, direction=1, frames=0;
    function stop() {
      if(timer!==null) clearInterval(timer);
      timer=null;
      el('play').textContent='Play prediction';el('play').setAttribute('aria-pressed','false');
    }
    const explanations = {
      encoder:'Encoder: the same fixed mapping turns each observation into [sin θ, cos θ]. These two coordinates describe the scene without reconstructing its pixels.',
      predictor:'Predictor: rotate the current latent vector to estimate the future latent. Increasing “Predictor fit” moves this estimate toward the target; it does not change the encoder or the observed future.',
      target:'Target: encode the actual future observation using the same encoder. The prediction loss compares this target with the predicted latent, not with a generated future image.'
    };
    function scene(svg,theta,color) {
      const x = 120 + 64*Math.sin(theta), y = 44 + 64*Math.cos(theta);
      svg.innerHTML = line(70,35,170,35,'stroke="var(--dy-line)" stroke-width="2"') + line(120,44,x,y,`stroke="${color}" stroke-width="2"`) + circle(120,44,3,'fill="var(--dy-blue)"') + circle(x,y,10,`fill="${color}"`) + line(120,44,120,120,'stroke="var(--dy-line)" stroke-dasharray="3 4"');
    }
    function render() {
      const degrees=Number(el('angle').value), fit=Number(el('fit').value)/100;
      const theta=degrees*Math.PI/180, advance=.65, predictedAdvance=advance+.9*(1-fit);
      const state=t=>[Math.sin(t),Math.cos(t)];
      const current=state(theta), target=state(theta+advance), predicted=state(theta+predictedAdvance);
      const loss=target.reduce((sum,v,i)=>sum+(v-predicted[i])**2,0);
      el('angle-value').textContent=`${degrees}°`;
      el('fit-value').textContent=`${Math.round(fit*100)}%`;
      el('state').textContent=`[${current.map(x=>x.toFixed(2)).join(', ')}]`;
      el('target').textContent=`[${target.map(x=>x.toFixed(2)).join(', ')}]`;
      el('loss').textContent=fixed(loss);
      scene(el('current'),theta,'var(--dy-blue)');
      scene(el('future'),theta+advance,'var(--dy-teal)');
      const xy=v=>[150+100*v[0],140-100*v[1]];
      const a=xy(current), b=xy(predicted), c=xy(target);
      const marker=(point,color,label,open=false)=>circle(...point,open?9:5,`fill="${open?'var(--dy-bg)':color}" stroke="${color}" stroke-width="2"`) + `<text x="${point[0]+12}" y="${point[1]-10}" style="fill:${color}">${label}</text>`;
      el('latent').innerHTML=circle(150,140,100,'fill="none" stroke="var(--dy-line)" stroke-dasharray="3 5"') + line(25,140,275,140,'stroke="var(--dy-line)"') + line(150,15,150,265,'stroke="var(--dy-line)"') + '<text x="270" y="157">z₁</text><text x="159" y="20">z₂</text>' + line(...a,...b,'stroke="var(--dy-red)" stroke-width="1.5" stroke-dasharray="5 4"') + line(...b,...c,'stroke="var(--dy-red)" stroke-width="3" opacity=".45"') + marker(c,'var(--dy-teal)','Target',true) + marker(a,'var(--dy-blue)','zₜ') + marker(b,'var(--dy-red)','ẑ');
      el('latent').setAttribute('aria-label',`Latent representations. Current ${current.map(fixed)}, predicted ${predicted.map(fixed)}, target ${target.map(fixed)}. Squared prediction error ${fixed(loss)}.`);
      for(const button of root.querySelectorAll('[data-jepa-stage]')) button.setAttribute('aria-pressed',String(button.dataset.jepaStage===stage));
      el('explanation').textContent=explanations[stage];
    }
    root.addEventListener('input',event=>{
      if(event.target===el('angle')) {stop();frames=0;}
      render();
    });
    root.addEventListener('click',event=>{
      const button=event.target.closest('button');if(!button)return;
      if(button.hasAttribute('data-jepa-play')) {
        if(timer!==null) stop();
        else {
          el('play').textContent='Pause prediction';el('play').setAttribute('aria-pressed','true');
          timer=setInterval(()=>{
            let degrees=Number(el('angle').value)+direction;
            if(degrees>=100) {degrees=100;direction=-1;}
            else if(degrees<=-100) {degrees=-100;direction=1;}
            el('angle').value=String(degrees);render();
            if(++frames>=900) {stop();frames=0;}
          },1000/30);
        }
      } else if(button.hasAttribute('data-jepa-reset')) {
        stop();direction=1;frames=0;stage='encoder';el('angle').value='-35';el('fit').value='55';render();
      } else if(button.hasAttribute('data-jepa-stage')) { stage=button.dataset.jepaStage; render(); }
    });
    document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
    window.addEventListener('pagehide',stop);
    render();
  }

  for(const root of document.querySelectorAll('[data-lehami-overview]')) {
    const el=name=>root.querySelector(`[data-flow-${name}]`);
    const initial=[.9,.15], h=.15, baseActions=[-.5,1,.7,1.2,-3.3];
    let cursor=0, reversing=false, completed=false, timer=null;
    function stop() {
      if(timer!==null) clearInterval(timer);
      timer=null;
      el('play').textContent='Play flow';el('play').setAttribute('aria-pressed','false');
      el('status').setAttribute('aria-live','polite');
    }
    function reset() { stop();cursor=0;reversing=false;completed=false;render(); }
    const step=([q,p],u,dt)=>{
      const mid=p-dt*(Math.sin(q)-u)/2;
      const next=q+dt*mid;
      return [next,mid-dt*(Math.sin(next)-u)/2];
    };
    const points=(values,map)=>values.map(v=>map(v).join(',')).join(' ');
    const path=(values,map,color,extra='')=>`<polyline points="${points(values,map)}" fill="none" stroke="${color}" ${extra.includes('stroke-width')?'':'stroke-width="1.8"'} ${extra}/>`;
    function projection(values,width,height,pad=20) {
      const xs=values.map(v=>v[0]),ys=values.map(v=>v[1]);
      const xmin=Math.min(...xs), xmax=Math.max(...xs), ymin=Math.min(...ys), ymax=Math.max(...ys);
      const dx=Math.max(.1,xmax-xmin)*1.2,dy=Math.max(.1,ymax-ymin)*1.2;
      const cx=(xmin+xmax)/2,cy=(ymin+ymax)/2;
      return v=>[pad+(v[0]-cx+dx/2)/dx*(width-2*pad),height-pad-(v[1]-cy+dy/2)/dy*(height-2*pad)];
    }
    function render() {
      const strength=Number(el('strength').value)/100;
      const actions=Array.from({length:20},(_,i)=>baseActions[Math.floor(i/4)]*strength);
      const states=[[...initial]], fine=[[...initial]];
      for(let i=0;i<20;i++) {
        states.push(step(states.at(-1),actions[i],h));
        for(let j=0;j<4;j++) fine.push(step(fine.at(-1),actions[i],h/4));
      }
      const backward=[states.at(-1)];
      for(let i=19;i>=0;i--) backward.push(step(backward.at(-1),actions[i],-h));
      const error=Math.hypot(...backward.at(-1).map((v,i)=>v-initial[i]));
      el('strength-value').textContent=`${Math.round(strength*100)}%`;
      const index=cursor, selected=Math.min(4,Math.floor(index/4)), u=actions[Math.min(index,19)];
      el('error').textContent=completed?error.toExponential(1):'—';
      const extent=Math.max(1.6,...states.flatMap(v=>v.map(Math.abs)))*1.22;
      const scale=125/extent, map=([q,p])=>[250+q*scale,153-p*scale];
      let svg='';
      // Fixed-action energy contours; the driven trajectory may cross them.
      for(const energy of [-2,-1,0,.3,.7,1.2,1.8,2.5,3.5,5,7]) for(const sign of [-1,1]) {
        let d='',connected=false;
        for(let j=0;j<=200;j++) {
          const q=-extent+2*extent*j/200, p2=2*(energy-1+Math.cos(q)+u*q);
          if(p2<0 || Math.sqrt(p2)>extent) {connected=false;continue;}
          const xy=map([q,sign*Math.sqrt(p2)]);
          d+=`${connected?'L':'M'}${xy[0].toFixed(2)} ${xy[1].toFixed(2)} `;connected=true;
        }
        svg+=`<path d="${d}" fill="none" stroke="var(--dy-line)" stroke-width="1"/>`;
      }
      svg+=line(30,153,470,153,'stroke="var(--dy-line)"')+line(250,15,250,288,'stroke="var(--dy-line)"');
      svg+=path(states,map,'var(--dy-blue)','opacity=".13"');
      svg+=path(states.slice(0,reversing?21:index+1),map,'var(--dy-blue)','stroke-width="2.5"');
      if(reversing) svg+=path(backward.slice(0,21-index),map,'var(--dy-red)','stroke-width="2.5" stroke-dasharray="5 4"');
      for(let i=0;i<5;i++) {
        const xy=map(states[i*4]);
        svg+=line(...xy,50+i*100,309,'stroke="var(--dy-blue)" stroke-dasharray="3 4" opacity=".3"');
        svg+=circle(...xy,i===selected?7:4,`fill="${i===selected?'var(--dy-teal)':'var(--dy-blue)'}" stroke="var(--dy-bg)" stroke-width="2"`);
        svg+=`<text x="${50+i*100}" y="327" text-anchor="middle" style="font-size:9px">state readout</text>`;
      }
      svg+=circle(...map(states[index]),7,'fill="var(--dy-teal)" stroke="var(--dy-bg)" stroke-width="2"');
      svg+='<text x="470" y="167">q</text><text x="260" y="18">p</text>';
      svg+=`<text x="25" y="18">Fixed-u contours · u = ${u.toFixed(2)}</text>`;
      el('phase').innerHTML=svg;
      el('phase').setAttribute('aria-label',`Driven pendulum phase-space trajectory. Selected step ${index}, q ${fixed(states[index][0])}, p ${fixed(states[index][1])}, action ${u.toFixed(2)}. Contours use this fixed action.`);
      el('frames').innerHTML=Array.from({length:5},(_,i)=>{
        const [q,p]=states[i*4], x=40+27*Math.sin(q),y=18+27*Math.cos(q);
        return `<button type="button" data-flow-frame="${i}" aria-pressed="${selected===i}" aria-label="Observation at step ${i*4}, action ${actions[i*4].toFixed(2)}"><span>xₜ₊${i*4}</span><svg viewBox="0 0 80 65" aria-hidden="true">${line(40,18,x,y,'stroke="var(--dy-blue)" stroke-width="2"')+circle(40,18,2,'fill="var(--dy-blue)"')+circle(x,y,5,'fill="var(--dy-red)"')}<text x="40" y="60" text-anchor="middle" style="font-size:8px">p ${p.toFixed(2)}</text></svg><span>u ${actions[i*4].toFixed(2)}</span></button>`;
      }).join('');
      const maxAction=Math.max(1,...actions.map(Math.abs)), actionMap=(i,a)=>[15+i/20*470,32-a/maxAction*20];
      let d='';
      for(let i=0;i<20;i++) {const a=actionMap(i,actions[i]),b=actionMap(i+1,actions[i]);d+=`${i?'L':'M'}${a.join(' ')} L${b.join(' ')} `;}
      el('actions').innerHTML=line(15,32,485,32,'stroke="var(--dy-line)" stroke-dasharray="3 4"')+`<path d="${d}" fill="none" stroke="var(--dy-teal)" stroke-width="2"/>`+line(actionMap(index,0)[0],5,actionMap(index,0)[0],55,'stroke="var(--dy-red)" stroke-width="1.5"')+'<text x="15" y="66">Prescribed action uₜ</text><text x="485" y="66" text-anchor="end">time →</text>';
      el('status').textContent=`${completed?'Returned to start':reversing?'Backward':'Forward'} · Step ${index} / 20 · q = ${fixed(states[index][0])} · p = ${fixed(states[index][1])} · u = ${u.toFixed(2)}`;
      const coarse=states.slice(0,index+1), subframes=fine.slice(0,index*4+1), smallMap=projection([...states,...fine],300,130);
      el('subframes').innerHTML=path(fine,smallMap,'var(--dy-teal)','opacity=".13"')+path(subframes,smallMap,'var(--dy-teal)','opacity=".55"')+subframes.map(v=>circle(...smallMap(v),2,'fill="var(--dy-teal)"')).join('')+coarse.map(v=>circle(...smallMap(v),4,'fill="var(--dy-blue)" stroke="var(--dy-bg)" stroke-width="1"')).join('')+'<text x="274" y="124">q</text><text x="8" y="18">p</text>';
      const forwardTime=states.map((v,i)=>[i,v[0]]), reverseTime=backward.map((v,i)=>[20-i,v[0]]), timeMap=projection([...forwardTime,...reverseTime],300,130);
      el('reverse').innerHTML=path(forwardTime,timeMap,'var(--dy-blue)','opacity=".13"')+path(forwardTime.slice(0,reversing?21:index+1),timeMap,'var(--dy-blue)','stroke-width="3"')+(reversing?path(reverseTime.slice(0,21-index),timeMap,'var(--dy-red)','stroke-dasharray="6 4"'):'')+circle(...timeMap([index,states[index][0]]),4,'fill="var(--dy-teal)"')+'<text x="8" y="16">q</text><text x="170" y="128">time in steps →</text>';
    }
    el('strength').addEventListener('input',reset);
    root.addEventListener('click',event=>{
      const button=event.target.closest('button');if(!button)return;
      if(button.hasAttribute('data-flow-reset')) reset();
      else if(button.hasAttribute('data-flow-play')) {
        if(timer!==null) stop();
        else {
          if(completed) reset();
          el('play').textContent='Pause flow';el('play').setAttribute('aria-pressed','true');
          el('status').setAttribute('aria-live','off');
          timer=setInterval(()=>{
            if(!reversing) { cursor++;if(cursor===20) reversing=true; }
            else { cursor--;if(cursor===0) {completed=true;stop();} }
            render();
          },250);
        }
      } else if(button.hasAttribute('data-flow-frame')) {
        stop();cursor=Number(button.dataset.flowFrame)*4;reversing=false;completed=false;render();
        root.querySelector(`[data-flow-frame="${cursor/4}"]`).focus();
      }
    });
    document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
    window.addEventListener('pagehide',stop);
    render();
  }

  for(const root of document.querySelectorAll('[data-pendulum-demo]')) {
    const el=name=>root.querySelector(`[data-pend-${name}]`);
    let q=0, p=0, timer=null, frames=0;
    function stop() {
      if(timer!==null) clearInterval(timer);
      timer=null;
      el('play').textContent='Play pendulum';
      el('play').setAttribute('aria-pressed','false');
    }
    function render() {
      const angle=Math.atan2(Math.sin(q),Math.cos(q));
      const k=p*p/2, v=1-Math.cos(q), total=k+v;
      el('q').textContent=fixed(angle); el('p').textContent=fixed(p);
      el('k').textContent=fixed(k); el('v').textContent=fixed(v);
      el('energy').textContent=fixed(total); el('force').textContent=fixed(-Math.sin(q));
      el('k-bar').style.width=`${total>1e-12?100*k/total:0}%`;
      el('v-bar').style.width=`${total>1e-12?100*v/total:0}%`;
      el('caption').textContent=Math.abs(p)<.04?(total<1e-8?'At rest at the bottom: q = p = 0.':'Almost stationary: momentum is near zero, but gravity can still change it.'):`Moving ${p>0?'clockwise':'counterclockwise'}. ${Math.abs(angle)<.2?'Near the bottom, most energy is kinetic.':'Energy shifts between height and motion.'}`;
      const x=200+142*Math.sin(q), y=98+142*Math.cos(q);
      const tangent=[Math.cos(q),-Math.sin(q)], length=38*p;
      const end=[x+length*tangent[0],y+length*tangent[1]], sign=Math.sign(p);
      let svg='<path d="M58 98 A142 142 0 0 0 342 98" fill="none" stroke="var(--dy-line)" stroke-dasharray="3 5"/>';
      svg+=line(155,85,245,85,'stroke="var(--dy-line)" stroke-width="3"')+line(200,98,200,255,'stroke="var(--dy-line)" stroke-dasharray="4 4"');
      if(Math.abs(angle)>.015) {
        const ax=200+40*Math.sin(angle), ay=98+40*Math.cos(angle);
        svg+=`<path d="M200 138 A40 40 0 0 ${angle>0?0:1} ${ax} ${ay}" fill="none" stroke="var(--dy-blue)" stroke-width="2"/>`;
      }
      svg+=line(200,98,x,y,'stroke="var(--dy-blue)" stroke-width="3"')+circle(200,98,4,'fill="var(--dy-blue)"')+circle(x,y,12,'fill="var(--dy-blue)"');
      svg+='<text x="212" y="130" style="fill:var(--dy-blue)">q</text><text x="166" y="275">q = 0</text>';
      if(Math.abs(p)>.025) {
        const tx=sign*tangent[0], ty=sign*tangent[1];
        svg+=line(x,y,...end,'stroke="var(--dy-red)" stroke-width="3"');
        svg+=`<path d="M${end[0]-8*tx-4*ty} ${end[1]-8*ty+4*tx} L${end.join(' ')} L${end[0]-8*tx+4*ty} ${end[1]-8*ty-4*tx}" fill="none" stroke="var(--dy-red)" stroke-width="2"/>`;
        svg+=`<text x="${end[0]+8}" y="${end[1]-8}" style="fill:var(--dy-red)">p</text>`;
      }
      el('scene').innerHTML=svg;
      el('scene').setAttribute('aria-label',`Pendulum angle ${fixed(angle)} radians, angular momentum ${fixed(p)}, kinetic energy ${fixed(k)}, potential energy ${fixed(v)}.`);
    }
    function reset() {
      stop(); frames=0;
      q=Number(el('angle').value)*Math.PI/180; p=Number(el('momentum').value)/100;
      el('angle-value').textContent=`${el('angle').value}°`;
      el('momentum-value').textContent=p.toFixed(2);
      render();
    }
    function tick() {
      const h=1/240;
      for(let i=0;i<4;i++) { p-=h*Math.sin(q)/2; q+=h*p; p-=h*Math.sin(q)/2; }
      frames++; render();
      if(frames>=1800) { stop();frames=0; }
    }
    root.addEventListener('click',event=>{
      const button=event.target.closest('button'); if(!button) return;
      if(button.hasAttribute('data-pend-reset')) reset();
      else if(button.hasAttribute('data-pend-play')) {
        if(timer!==null) stop();
        else { el('play').textContent='Pause pendulum';el('play').setAttribute('aria-pressed','true');timer=setInterval(tick,1000/60); }
      }
    });
    el('angle').addEventListener('input',reset); el('momentum').addEventListener('input',reset);
    document.addEventListener('visibilitychange',()=>{if(document.hidden) stop();});
    window.addEventListener('pagehide',stop);
    reset();
  }

  for(const root of document.querySelectorAll('[data-hamiltonian-demo]')) {
    const el=name=>root.querySelector(`[data-ham-${name}]`);
    let method='leapfrog', h=.25, state, patch, history, steps, substep, timer=null;
    const initial=[.95,.25], energy=v=>(v[0]**2+v[1]**2)/2;
    const area=points=>Math.abs(points.reduce((sum,a,i)=>{ const b=points[(i+1)%points.length]; return sum+a[0]*b[1]-a[1]*b[0]; },0))/2;
    let initialArea;
    function stop() {
      if(timer!==null) clearInterval(timer);
      timer=null;
      el('play').textContent='Play rollout';
      el('play').setAttribute('aria-pressed','false');
    }
    function reset() {
      stop(); steps=0; substep=0; state=[...initial]; history=[[...state]];
      patch=Array.from({length:40},(_,i)=>[initial[0]+.13*Math.cos(TAU*i/40),initial[1]+.13*Math.sin(TAU*i/40)]);
      initialArea=area(patch);
      render('Press Play rollout to transport the state and its nearby patch. Each leapfrog step combines two half kicks and a full drift.');
    }
    function advance() {
      if(steps>=40) return;
      let transform, message;
      if(method==='euler') {
        transform=([q,p])=>[q+h*p,p-h*q];
        message='Euler updates both coordinates from the old state. Each step expands phase-space area and increases energy in this oscillator.';
      } else if(substep===1) {
        transform=([q,p])=>[q+h*p,p];
        message='Full drift: position changes using the intermediate momentum. This horizontal shear preserves patch area.';
      } else {
        transform=([q,p])=>[q,p-h*q/2];
        message=substep===0?'First half kick: momentum changes while position stays fixed. This vertical shear preserves patch area.':'Final half kick: momentum uses the new position. The full leapfrog step is complete; area is preserved, but energy need not be exactly constant.';
      }
      state=transform(state); patch=patch.map(transform); history.push([...state]);
      if(method==='euler') steps++;
      else { substep=(substep+1)%3; if(substep===0) steps++; }
      if(steps>=40) stop();
      render(message);
    }
    function render(message) {
      h=Number(el('h').value)/100;
      el('h-value').textContent=h.toFixed(2);
      el('q').textContent=fixed(state[0]); el('p').textContent=fixed(state[1]);
      el('count').textContent=String(steps);
      el('area').textContent=area(patch)/initialArea<1000?(area(patch)/initialArea).toFixed(4)+'×':(area(patch)/initialArea).toExponential(2)+'×';
      el('energy').textContent=(energy(state)/energy(initial)).toFixed(4)+'×';
      if(message) el('explanation').textContent=message;
      el('play').disabled=steps>=40;
      for(const button of root.querySelectorAll('[data-ham-method]')) button.setAttribute('aria-pressed',String(button.dataset.hamMethod===method));
      for(const stage of root.querySelectorAll('[data-ham-stage]')) {
        stage.hidden=method==='euler';
        stage.classList.toggle('is-active',Number(stage.dataset.hamStage)===substep && steps<40);
      }
      // Expand the view uniformly so Euler's growing trajectory remains visible.
      const extent=Math.max(1.4,...history.flatMap(v=>v.map(Math.abs)),...patch.flatMap(v=>v.map(Math.abs)))*1.16;
      const scale=145/extent, xy=([q,p])=>[200+q*scale,180-p*scale];
      let svg='';
      for(const r of [.5,1,1.5,2,4,8,16,32]) if(r<=extent) svg+=circle(200,180,r*scale,'fill="none" stroke="var(--dy-line)" opacity=".65"');
      svg+=line(25,180,375,180,'stroke="var(--dy-line)"')+line(200,20,200,340,'stroke="var(--dy-line)"');
      svg+='<text x="378" y="184">q</text><text x="207" y="24">p</text>';
      svg+=`<text x="28" y="330">Axis range ±${extent.toFixed(1)}</text>`;
      const points=values=>values.map(v=>xy(v).join(',')).join(' ');
      const initialPatch=Array.from({length:40},(_,i)=>[initial[0]+.13*Math.cos(TAU*i/40),initial[1]+.13*Math.sin(TAU*i/40)]);
      svg+=`<polygon points="${points(initialPatch)}" fill="none" stroke="var(--dy-teal)" opacity=".35" stroke-dasharray="3 3"/>`;
      svg+=`<polyline points="${points(history)}" fill="none" stroke="var(--dy-red)" stroke-width="1.7" opacity=".8"/>`;
      svg+=`<polygon points="${points(patch)}" fill="var(--dy-teal)" fill-opacity=".18" stroke="var(--dy-teal)" stroke-width="1.5"/>`;
      svg+=circle(...xy(state),4,'fill="var(--dy-red)"');
      el('phase').innerHTML=svg;
      el('phase').setAttribute('aria-label',`${method}, ${steps} completed steps. Position ${fixed(state[0])}, momentum ${fixed(state[1])}. Patch area ratio ${(area(patch)/initialArea).toFixed(4)}; energy ratio ${(energy(state)/energy(initial)).toFixed(4)}. Axes automatically rescale.`);
    }
    root.addEventListener('click',event=>{
      const button=event.target.closest('button'); if(!button) return;
      if(button.hasAttribute('data-ham-method')) { method=button.dataset.hamMethod; reset(); }
      else if(button.hasAttribute('data-ham-reset')) reset();
      else if(button.hasAttribute('data-ham-play')) {
        if(timer!==null) stop();
        else {
          el('play').textContent='Pause rollout'; el('play').setAttribute('aria-pressed','true');
          timer=setInterval(()=>{ const remaining=method==='euler'?1:3-substep; for(let i=0;i<remaining;i++) advance(); },350);
        }
      }
    });
    el('h').addEventListener('input',()=>{h=Number(el('h').value)/100;reset();});
    // Do not keep running while the reader switches tabs or leaves the page.
    document.addEventListener('visibilitychange',()=>{if(document.hidden) stop();});
    window.addEventListener('pagehide',stop);
    reset();
  }
})();
