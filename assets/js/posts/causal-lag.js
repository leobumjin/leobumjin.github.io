(() => {
  const root = document.querySelector('.causal-lag');
  if (!root) return;
  const ko = root.dataset.lang === 'kr';
  const svg = root.querySelector('svg');
  const ns = 'http://www.w3.org/2000/svg';
  function el(tag, attrs, text, parent = svg) {
    const node = document.createElementNS(ns, tag);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
    if (text) node.textContent = text;
    parent.append(node);
    return node;
  }
  // Approximate landmarks read from the supplied book figure; not a dataset.
  const smoking = [[1900,50],[1910,130],[1915,300],[1920,800],[1925,1150],[1930,1600],[1933,1350],[1937,1850],[1940,2100],[1943,3200],[1945,3700],[1948,3750],[1951,4200],[1953,3850],[1956,4100],[1960,4600],[1963,4700],[1965,4550],[1967,4600],[1969,4300],[1973,4500],[1976,4450],[1980,4200],[1985,3750],[1990,3200],[1995,2900],[1998,2800],[2000,2450],[2005,2150],[2010,1700],[2012,1500]];
  const mortality = [[1930,5],[1935,7],[1940,11],[1945,16],[1950,24],[1955,32],[1960,43],[1965,53],[1970,67],[1975,76],[1980,85],[1985,90],[1990,91],[1993,89],[1995,85],[2000,78],[2005,70],[2010,58],[2012,53]];
  const x = year => 72 + (year - 1900) / 115 * 650;
  const y = fraction => 340 - fraction * 280;
  const defs = el('defs', {});
  const clip = el('clipPath', {id:'causal-clip'}, '', defs);
  el('rect', {x:72,y:60,width:650,height:280}, '', clip);
  for (let i = 0; i <= 5; i++) {
    const h = y(i/5);
    el('line',{x1:72,x2:722,y1:h,y2:h,stroke:'currentColor','stroke-opacity':'.13'});
    el('text',{x:62,y:h+4,'text-anchor':'end'},String(i*1000));
    el('text',{x:732,y:h+4},String(i*20));
  }
  for (let year=1900; year<=2010; year+=20) {
    el('text',{x:x(year),y:365,'text-anchor':'middle'},String(year));
  }
  el('text',{x:72,y:25},ko?'연간 1인당 담배 소비량 (개비)':'Cigarettes per capita per year');
  el('text',{x:722,y:45,'text-anchor':'end'},ko?'남성 10만 명당 폐암 사망률':'Lung cancer deaths per 100,000 males');
  el('text',{x:397,y:400,'text-anchor':'middle'},ko?'연도 · 미국':'Year · United States');
  const plot = el('g', {'clip-path':'url(#causal-clip)'});
  const path = (points,max,shift=0) => points.map(([year,value],i)=>`${i?'L':'M'}${x(year+shift).toFixed(2)},${y(value/max).toFixed(2)}`).join(' ');
  el('path',{d:path(mortality,100),fill:'none',stroke:'currentColor','stroke-width':3,'stroke-dasharray':'7 4',class:'causal-mortality'},'',plot);
  const line = el('path',{d:path(smoking,5000),fill:'none',stroke:'currentColor','stroke-width':3,class:'causal-smoking'},'',plot);
  const slider = root.querySelector('input');
  const output = root.querySelector('output');
  function update() {
    const shift = Number(slider.value);
    line.setAttribute('d',path(smoking,5000,shift));
    output.value = String(shift);
    slider.setAttribute('aria-valuetext',ko?`${shift}년 뒤로 이동`:`Shifted ${shift} years later`);
  }
  slider.addEventListener('input',update);
  root.querySelector('button').addEventListener('click',()=>{slider.value='0';update();});
  root.querySelector('.causal-lag-controls').hidden=false;
  update();
})();
