import{q as u,d as q,n as J,t as K,e as X,w as _,u as j,p as B,B as H,aB as I,aS as Y,aU as ee,f as te,D as ae,aD as ie,aV as w,aW as re,aX as O}from"./index-sJJkRNmh.js";import{t as ne}from"./chunk-4BX2VUAB-C-8oH5OZ-BfsHuISQ.js";import{G as le}from"./treemap-KMMF4GRG-DkU9X3aX-uOGK8ve8.js";import{h as P}from"./arc-CVNxEulK-FjaFW7fR.js";import{h as oe}from"./ordinal-B6-f3MAq-Pc8f3NoK.js";import"./markdown-D8NX56fe.js";import"./react-vendor-DabIWvu9.js";import"./mermaid-CVR_yEWu.js";import"./katex-XbL3y5x-.js";import"./min-D09ly9DN-BGStTWT7.js";import"./_baseUniq-DvG_IMU9-ChRGCy6e.js";import"./init-DjUOC4st-DHuO7-vr.js";function se(e,a){return a<e?-1:a>e?1:a>=e?0:NaN}function pe(e){return e}function ce(){var e=pe,a=se,f=null,o=w(0),s=w(O),y=w(0);function l(t){var r,p=(t=re(t)).length,d,v,h=0,c=new Array(p),n=new Array(p),x=+o.apply(this,arguments),S=Math.min(O,Math.max(-O,s.apply(this,arguments)-x)),m,D=Math.min(Math.abs(S)/p,y.apply(this,arguments)),T=D*(S<0?-1:1),g;for(r=0;r<p;++r)(g=n[c[r]=r]=+e(t[r],r,t))>0&&(h+=g);for(a!=null?c.sort(function($,A){return a(n[$],n[A])}):f!=null&&c.sort(function($,A){return f(t[$],t[A])}),r=0,v=h?(S-p*T)/h:0;r<p;++r,x=m)d=c[r],g=n[d],m=x+(g>0?g*v:0)+T,n[d]={data:t[d],index:r,value:g,startAngle:x,endAngle:m,padAngle:D};return n}return l.value=function(t){return arguments.length?(e=typeof t=="function"?t:w(+t),l):e},l.sortValues=function(t){return arguments.length?(a=t,f=null,l):a},l.sort=function(t){return arguments.length?(f=t,a=null,l):f},l.startAngle=function(t){return arguments.length?(o=typeof t=="function"?t:w(+t),l):o},l.endAngle=function(t){return arguments.length?(s=typeof t=="function"?t:w(+t),l):s},l.padAngle=function(t){return arguments.length?(y=typeof t=="function"?t:w(+t),l):y},l}var ue=ie.pie,F={sections:new Map,showData:!1},b=F.sections,Q=F.showData,de=structuredClone(ue),ge=u(()=>structuredClone(de),"getConfig"),fe=u(()=>{b=new Map,Q=F.showData,ae()},"clear"),me=u(({label:e,value:a})=>{if(a<0)throw new Error(`"${e}" has invalid value: ${a}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);b.has(e)||(b.set(e,a),B.debug(`added new section: ${e}, with value: ${a}`))},"addSection"),he=u(()=>b,"getSections"),xe=u(e=>{Q=e},"setShowData"),we=u(()=>Q,"getShowData"),V={getConfig:ge,clear:fe,setDiagramTitle:j,getDiagramTitle:_,setAccTitle:X,getAccTitle:K,setAccDescription:J,getAccDescription:q,addSection:me,getSections:he,setShowData:xe,getShowData:we},ye=u((e,a)=>{ne(e,a),a.setShowData(e.showData),e.sections.map(a.addSection)},"populateDb"),ve={parse:u(async e=>{const a=await le("pie",e);B.debug(a),ye(a,V)},"parse")},Se=u(e=>`
  .pieCircle{
    stroke: ${e.pieStrokeColor};
    stroke-width : ${e.pieStrokeWidth};
    opacity : ${e.pieOpacity};
  }
  .pieOuterCircle{
    stroke: ${e.pieOuterStrokeColor};
    stroke-width: ${e.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${e.pieTitleTextSize};
    fill: ${e.pieTitleTextColor};
    font-family: ${e.fontFamily};
  }
  .slice {
    font-family: ${e.fontFamily};
    fill: ${e.pieSectionTextColor};
    font-size:${e.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${e.pieLegendTextColor};
    font-family: ${e.fontFamily};
    font-size: ${e.pieLegendTextSize};
  }
`,"getStyles"),$e=Se,Ae=u(e=>{const a=[...e.values()].reduce((o,s)=>o+s,0),f=[...e.entries()].map(([o,s])=>({label:o,value:s})).filter(o=>o.value/a*100>=1).sort((o,s)=>s.value-o.value);return ce().value(o=>o.value)(f)},"createPieArcs"),De=u((e,a,f,o)=>{B.debug(`rendering pie chart
`+e);const s=o.db,y=H(),l=I(s.getConfig(),y.pie),t=40,r=18,p=4,d=450,v=d,h=Y(a),c=h.append("g");c.attr("transform","translate("+v/2+","+d/2+")");const{themeVariables:n}=y;let[x]=ee(n.pieOuterStrokeWidth);x??=2;const S=l.textPosition,m=Math.min(v,d)/2-t,D=P().innerRadius(0).outerRadius(m),T=P().innerRadius(m*S).outerRadius(m*S);c.append("circle").attr("cx",0).attr("cy",0).attr("r",m+x/2).attr("class","pieOuterCircle");const g=s.getSections(),$=Ae(g),A=[n.pie1,n.pie2,n.pie3,n.pie4,n.pie5,n.pie6,n.pie7,n.pie8,n.pie9,n.pie10,n.pie11,n.pie12];let C=0;g.forEach(i=>{C+=i});const R=$.filter(i=>(i.data.value/C*100).toFixed(0)!=="0"),k=oe(A);c.selectAll("mySlices").data(R).enter().append("path").attr("d",D).attr("fill",i=>k(i.data.label)).attr("class","pieCircle"),c.selectAll("mySlices").data(R).enter().append("text").text(i=>(i.data.value/C*100).toFixed(0)+"%").attr("transform",i=>"translate("+T.centroid(i)+")").style("text-anchor","middle").attr("class","slice"),c.append("text").text(s.getDiagramTitle()).attr("x",0).attr("y",-400/2).attr("class","pieTitleText");const W=[...g.entries()].map(([i,z])=>({label:i,value:z})),M=c.selectAll(".legend").data(W).enter().append("g").attr("class","legend").attr("transform",(i,z)=>{const N=r+p,L=N*W.length/2,U=12*r,Z=z*N-L;return"translate("+U+","+Z+")"});M.append("rect").attr("width",r).attr("height",r).style("fill",i=>k(i.label)).style("stroke",i=>k(i.label)),M.append("text").attr("x",r+p).attr("y",r-p).text(i=>s.getShowData()?`${i.label} [${i.value}]`:i.label);const G=Math.max(...M.selectAll("text").nodes().map(i=>i?.getBoundingClientRect().width??0)),E=v+t+r+p+G;h.attr("viewBox",`0 0 ${E} ${d}`),te(h,d,E,l.useMaxWidth)},"draw"),Te={draw:De},Ne={parser:ve,db:V,renderer:Te,styles:$e};export{Ne as diagram};
