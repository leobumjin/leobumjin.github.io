(function () {
  'use strict';
  const samples=[[-3,-1],[-2,-1.8],[-1.7,-.2],[-.8,-1.1],[0,.5],[.7,.1],[1.2,1.4],[2,1.1],[2.8,2.1],[-1.5,3]];
  function calculate(included) {
    const active=samples.filter((_,i)=>included[i]),n=active.length;
    const mean=n?[0,1].map(j=>active.reduce((s,p)=>s+p[j],0)/n):null;
    const terms=samples.map(p=>mean?[[ (p[0]-mean[0])**2,(p[0]-mean[0])*(p[1]-mean[1])],[(p[0]-mean[0])*(p[1]-mean[1]),(p[1]-mean[1])**2]]:null);
    if(n<2)return {n,mean,terms,covariance:null,axes:[]};
    const c=[[0,0],[0,0]];
    terms.forEach((m,k)=>{if(included[k])m.forEach((r,i)=>r.forEach((v,j)=>c[i][j]+=v/(n-1)));});
    const a=c[0][0],b=c[0][1],d=c[1][1],gap=Math.hypot(a-d,2*b),angle=.5*Math.atan2(2*b,a-d);
    const axes=[{value:(a+d+gap)/2,vector:[Math.cos(angle),Math.sin(angle)]},{value:Math.max(0,(a+d-gap)/2),vector:[-Math.sin(angle),Math.cos(angle)]}];
    return {n,mean,terms,covariance:c,axes,unique:gap>1e-10};
  }
  if(typeof module!=='undefined'&&module.exports)module.exports={samples,calculate};
  if(typeof document==='undefined')return;
  const root=document.getElementById('covariance-interactive');if(!root)return;
  const included=samples.map(()=>true),get=id=>document.getElementById(id),ns='http://www.w3.org/2000/svg';
  const xy=p=>[180+p[0]*26,185-p[1]*26];
  function svgEl(parent,tag,attrs,text) {
    const node=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>node.setAttribute(k,String(v)));
    if(text)node.textContent=text;parent.appendChild(node);return node;
  }
  function line(svg,a,b,cls) {const p=xy(a),q=xy(b);svgEl(svg,'line',{x1:p[0],y1:p[1],x2:q[0],y2:q[1],class:cls});}
  function toggle(i,focusPoint=false) {
    if(i>2)return;
    included[i]=!included[i];render();
    if(focusPoint)get('cov-samples').querySelector(`[data-sample="${i}"]`).focus();
  }
  const buttons=samples.map((_,i)=>{
    const term=document.createElement('div');term.className='cov-term-group';
    if(i){const plus=document.createElement('span');plus.className='cov-plus';plus.textContent='+';term.appendChild(plus);}
    const button=document.createElement(i<3?'button':'span');
    if(i<3)button.type='button';
    button.className='cov-term'+(i<3?' is-toggle':' is-fixed');
    const sub='₁₂₃₄₅₆₇₈₉'.charAt(i)||'₁₀';
    button.textContent=`u${sub}u${sub}ᵀ`;
    if(i<3)button.addEventListener('click',()=>toggle(i));
    term.appendChild(button);get('cov-terms').appendChild(term);
    return {term,button};
  });
  function draw(svg,state,principal) {
    svg.replaceChildren();
    line(svg,[-5.7,0],[5.7,0],'cov-coordinate');line(svg,[0,-4.7],[0,5.7],'cov-coordinate');
    svgEl(svg,'text',{x:335,y:203,class:'cov-coordinate-label'},'x');svgEl(svg,'text',{x:190,y:28,class:'cov-coordinate-label'},'y');
    samples.forEach((p,i)=>{
      const [x,y]=xy(p),group=svgEl(svg,'g',{'data-sample':i,class:`cov-sample ${i<3?'is-toggle ':''}${included[i]?'':'is-excluded'}`});
      if(!principal&&i<3){
        group.setAttribute('role','button');group.setAttribute('tabindex','0');group.setAttribute('aria-label',`Sample ${i+1}: ${included[i]?'included; remove':'excluded; restore'}`);group.setAttribute('aria-pressed',String(included[i]));
        group.addEventListener('click',()=>toggle(i));group.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle(i,true);}});
        svgEl(group,'circle',{cx:x,cy:y,r:15,class:'cov-hit-target'});
      }
      svgEl(group,'circle',{cx:x,cy:y,r:5,class:'cov-point'});
      if(!principal)svgEl(group,'text',{x:x+8,y:y-8,class:'cov-sample-label'},String(i+1));
    });
    if(principal&&state.n>=2&&state.unique){
      state.axes.forEach(({value,vector},i)=>{
        if(value<1e-10)return;
        const end=vector.map((v,j)=>state.mean[j]+2*Math.sqrt(value)*v),start=vector.map((v,j)=>state.mean[j]-2*Math.sqrt(value)*v);
        line(svg,start,end,`cov-principal cov-pc${i+1}`);
        const [x,y]=xy(end);svgEl(svg,'text',{x:x+7,y:y-10,class:`cov-pc-label cov-pc${i+1}`},`q${i+1}`);
      });
    }
    if(state.mean){const [x,y]=xy(state.mean);svgEl(svg,'circle',{cx:x,cy:y,r:4,class:'cov-mean'});svgEl(svg,'text',{x:x+7,y:y+18,class:'cov-mean-label'},'μ');}
  }
  function render() {
    const state=calculate(included);draw(get('cov-samples'),state,false);draw(get('cov-principal'),state,true);
    buttons.forEach(({term,button},i)=>{
      term.classList.toggle('is-excluded',!included[i]);
      if(i<3){button.setAttribute('aria-pressed',String(included[i]));button.setAttribute('aria-label',`Sample ${i+1}: ${included[i]?'included; remove':'excluded; restore'}`);}
    });
    const denominator=get('cov-denominator');denominator.textContent=state.n>=2?`${state.n} − 1 = ${state.n-1}`:`${state.n} included · covariance undefined`;
    root.classList.toggle('is-undefined',state.n<2);
    let message=`${state.n} samples · `;
    if(!state.n)message+='No samples: the mean, covariance, and PCA directions are undefined.';
    else if(state.n===1)message+='One sample: the mean exists, but sample covariance and PCA directions are undefined.';
    else if(!state.unique)message+='Equal eigenvalues: no unique preferred principal direction.';
    else {const total=state.axes.reduce((s,a)=>s+a.value,0);message+=`PC1 ${(100*state.axes[0].value/total).toFixed(1)}%${state.axes[1].value<1e-10?' Rank-one covariance: the second component has zero variance.':''}`;}
    get('cov-summary').textContent=message;
  }
  get('cov-restore').addEventListener('click',()=>{included.fill(true);render();});
  render();
})();
