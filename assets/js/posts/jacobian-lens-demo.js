/* Constructed linear example. These maps are specified by hand, not learned.
 * F_layer,token(x) = K_layer,token x, so its exact Jacobian is K.
 * Both routes decode with the same L2 norm, W_U = 3I, and softmax.
 */
(() => {
  'use strict';
  const concepts = ['Eagle', 'Penguin', 'Fly', 'Swim'];
  const tokens = ['The', 'bird', 'can', 'fly', '.'];
  const states = [[.4, .4, .4, .1], [1, 1, 1, .1], [.2, .2, 1, .2], [.1, .1, 2, .1], [.3, .3, .5, .1]];
  const maps = {
    2: [[1, 1, 1, 1], [2, 2, .1, .1], [.8, .8, .5, .1], [.4, .4, 2, .1], [1, 1, 1, .1]],
    3: [[1, 1, 1, 1], [.1, .1, 3, .1], [.8, .8, .5, .1], [.1, .1, 3, .1], [.5, .5, 1, .1]],
  };
  function decode(vector) {
    const length = Math.hypot(...vector);
    const logits = vector.map(x => 3 * x / Math.max(length, 1e-12));
    const weights = logits.map(x => Math.exp(x - Math.max(...logits)));
    const sum = weights.reduce((a, b) => a + b, 0);
    return weights.map(x => x / sum);
  }
  const identity = Array.from({length:4}, (_,i) => Array.from({length:4}, (_,j) => +(i === j)));
  // Standalone, fixed illustrative matrix and hidden; independent of graph selection.
  const exampleJ = [[.72,-.18,.31,.09],[.14,.53,-.22,.38],[-.27,.16,1.12,-.08],[.06,-.34,.25,.67]];
  const exampleHidden = [.99,.33,-.87,-.63];
  function averageMatrix(layer, selection) {
    if (!selection.length) return null;
    return identity.map((row,i) => row.map((_,j) => i === j ? selection.reduce((sum,t) => sum + maps[layer][t][i],0) / selection.length : 0));
  }
  const multiply = (matrix, h) => matrix.map(row => row.reduce((sum,x,i) => sum+x*h[i],0));
  for (const root of document.querySelectorAll('[data-jacobian-demo]')) {
    let layer = 2, source = 1, selected = [1], route = 'jacobian';
    const el = name => root.querySelector(`[data-jl-${name}]`);
    function nodes(row) {
      return tokens.map((token,t) => `<button type="button" class="jl-node" ${row === 0 ? `data-source="${t}"` : `data-output="${t}" data-row="${row}"`} aria-label="Layer ${row}, position ${t}: ${token}" aria-pressed="${row === 0 ? source === t : row === layer && selected.includes(t)}" ${(row === 0 ? ![1,2].includes(t) : t < source) ? 'disabled' : ''}><span>h<sub>${row},${t}</sub></span></button>`).join('');
    }
    function drawGraph() {
      const svg=el('edges'), area=svg.getBoundingClientRect();
      svg.setAttribute('viewBox',`0 0 ${area.width} ${area.height}`);
      const box=(row,t)=>root.querySelector(row === 0 ? `[data-source="${t}"]` : `[data-output="${t}"][data-row="${row}"]`).getBoundingClientRect();
      const paths=[];
      for(const [lower,upper] of [[0,2],[2,3]]) for(let t=0;t<5;t++) for(let j=0;j<=t;j++) {
        const from=box(lower,j), to=box(upper,t);
        const x1=from.left-area.left+from.width/2, y1=from.top-area.top;
        const x2=to.left-area.left+to.width/2, y2=to.bottom-area.top;
        const mid=(y1+y2)/2;
        const active=lower === 0 ? j === source && (layer === 2 ? selected.includes(t) : t >= source && selected.some(output=>output>=t)) : layer === 3 && j >= source && selected.includes(t);
        paths.push(`<path d="M ${x1} ${y1} C ${x1} ${mid},${x2} ${mid},${x2} ${y2}" class="${active ? 'is-active' : ''}"/>`);
      }
      svg.innerHTML=paths.join('');
    }
    function drawWire() {
      drawGraph();
      const network=el('network'), wire=el('wire');
      const origin=network.getBoundingClientRect();
      const target=root.querySelector('.jl-route-block').getBoundingClientRect();
      const endX=target.left-origin.left, endY=target.top-origin.top+target.height/2;
      const nodes=[root.querySelector(`[data-source="${source}"]`)];
      const left=-10, radius=6;
      wire.setAttribute('viewBox',`0 0 ${origin.width} ${origin.height}`);
      wire.innerHTML=nodes.map(node=>{
        const box=node.getBoundingClientRect();
        const x=box.left-origin.left+box.width/2, y=box.bottom-origin.top;
        const bottom=y+14;
        return `<path d="M ${x} ${y} V ${bottom-radius} Q ${x} ${bottom} ${x-radius} ${bottom} H ${left+radius} Q ${left} ${bottom} ${left} ${bottom-radius} V ${endY+radius} Q ${left} ${endY} ${left+radius} ${endY} H ${endX}"/><path class="jl-wire-tip" d="M ${endX-5} ${endY-3} L ${endX} ${endY} L ${endX-5} ${endY+3}"/>`;
      }).join('');
    }
    function render() {
      root.classList.toggle('jl-direct', route === 'direct');
      el('inputs').innerHTML = nodes(0);
      el('layer2').innerHTML = nodes(2);
      el('layer3').innerHTML = nodes(3);
      for(const button of root.querySelectorAll('[data-route]')) button.setAttribute('aria-pressed', String(button.dataset.route === route));
      const empty=route === 'jacobian' && !selected.length;
      const matrix = route === 'direct' ? identity : (averageMatrix(layer,selected) || identity.map(row=>row.map(()=>0)));
      const h=states[source], result=matrix ? multiply(matrix,h) : null;
      el('status').textContent = `Input: ${tokens[source]} · layer ${layer} outputs: ${selected.length ? selected.map(t=>tokens[t]+' ['+t+']').join(' + ') : 'none (zero placeholders)'}`;
      const probabilities=empty ? [0,0,0,0] : decode(result);
      el('route-label').textContent = route === 'direct' ? 'h' : 'Gₛh';
      el('route-detail').textContent = route === 'direct' ? `Input hidden: ${tokens[source]} · identity I` : `Mean of ${selected.length} Jacobian${selected.length === 1 ? '' : 's'} · layer ${layer}`;
      if(result) {
        const length=Math.max(Math.hypot(...result),1e-12);
        el('logits').textContent = result.map(x => (3*x/length).toFixed(2)).join(' · ');
        const top=probabilities.indexOf(Math.max(...probabilities));
        el('prediction').textContent = empty ? '0.0%' : `${concepts[top]} · ${(100*probabilities[top]).toFixed(1)}%`;
      } else {
        el('logits').textContent = 'Select an output node';
        el('prediction').textContent = '—';
      }
      el('bars').innerHTML = probabilities ? concepts.map((name,i)=>`<div class="jl-bar-row"><span>${name}</span><div class="jl-track"><i style="width:${(100*probabilities[i]).toFixed(3)}%;background:var(${route === 'direct' ? '--jl-blue' : '--jl-red'})"></i></div><span>${(100*probabilities[i]).toFixed(1)}%</span></div>`).join('') : '';
      drawWire();
    }
    const wireObserver=new ResizeObserver(drawWire);
    wireObserver.observe(el('network'));
    root.addEventListener('click', event => {
      const button=event.target.closest('button');
      if(!button || !root.contains(button)) return;
      let focusSelector;
      if(button.hasAttribute('data-source')) {
        if(![1,2].includes(Number(button.dataset.source))) return;
        source=Number(button.dataset.source);
        selected=selected.filter(t=>t>=source);
        if(!selected.length) selected=[source];
        focusSelector=`[data-source="${source}"]`;
      } else if(button.hasAttribute('data-output')) {
        const t=Number(button.dataset.output), nextLayer=Number(button.dataset.row);
        if(t<source) return;
        if(nextLayer !== layer) { layer=nextLayer; selected=[t]; }
        else selected=selected.includes(t) ? selected.filter(i=>i!==t) : [...selected,t].sort();
        focusSelector=`[data-output="${t}"][data-row="${layer}"]`;
      } else if(button.hasAttribute('data-route')) route=button.dataset.route;
      else return;
      render();
      if(focusSelector) root.querySelector(focusSelector).focus();
    });
    render();
  }
  for(const root of document.querySelectorAll('[data-jacobian-matrix]')) {
    let matrixRoute='jacobian';
    const ko=root.dataset.lang === 'kr';
    const el=name=>root.querySelector(`[data-jl-${name}]`);
    function block(label, values, columns) {
      return `<div class="jl-operand"><span>${label}</span><div class="jl-bracket" style="grid-template-columns:repeat(${columns},1fr)">${values.map(x => `<span>${x.toFixed(2)}</span>`).join('')}</div></div>`;
    }
    function renderMatrix() {
      for(const button of root.querySelectorAll('[data-matrix-route]')) button.setAttribute('aria-pressed', String(button.dataset.matrixRoute === matrixRoute));
      const shownMatrix=matrixRoute === 'direct' ? identity : exampleJ;
      const shownResult=multiply(shownMatrix,exampleHidden);
      el('formula').textContent = matrixRoute === 'direct' ? 'I × h = h' : 'J × h = Jh';
      const matrixBlock=block(matrixRoute === 'direct' ? 'Identity I · 4 × 4' : 'Example J · 4 × 4',shownMatrix.flat(),4);
      const annotatedMatrix=matrixRoute === 'direct' ? `<div class="jl-identity-matrix">${matrixBlock}</div>` : `<div class="jl-annotated-matrix">${matrixBlock}<svg class="jl-underbrace" viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true"><path d="M 1 1 Q 1 9 12 9 H 87 Q 100 9 100 19 Q 100 9 113 9 H 188 Q 199 9 199 1"/></svg><p class="jl-matrix-meaning">${ko ? '입력이 출력 표현의 어떤 개념을 활성화하는지 나타낸다.' : 'Shows which concepts in the output representation the input activates.'}</p></div>`;
      el('product').innerHTML = annotatedMatrix + '<b>×</b>' + block('Fixed h · 4D',exampleHidden,1) + '<b>=</b>' + block(matrixRoute === 'direct' ? 'h · 4D' : 'Jh · 4D',shownResult,1) + '<span class="jl-read-arrow" aria-hidden="true">→</span><div class="jl-read-unembedding"><span>Read by</span><strong>Unembedding</strong><small>Wᵤ → logits</small></div>';
    }
    root.addEventListener('click',event=>{
      const button=event.target.closest('[data-matrix-route]');
      if(!button || !root.contains(button)) return;
      matrixRoute=button.dataset.matrixRoute;
      renderMatrix();
    });
    renderMatrix();
  }
})();
