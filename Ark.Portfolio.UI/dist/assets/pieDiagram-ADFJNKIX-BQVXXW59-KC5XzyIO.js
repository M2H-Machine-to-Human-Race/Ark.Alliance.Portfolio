import{q as u,e as q,n as J,t as K,f as X,y as Y,w as _,p as O,B as j,aC as H,aT as I,aV as ee,g as te,E as ae,aE as ie,aW as w,aX as ne,aY as E}from"./ui-lib-Cw8qKZ8E.js";import{t as re}from"./chunk-4BX2VUAB-C-8oH5OZ-_YpNVVKe.js";import{G as le}from"./treemap-KMMF4GRG-DkU9X3aX-B7nuOiNZ.js";import{h as P}from"./arc-CVNxEulK-k5BkQFH3.js";import{h as se}from"./ordinal-B6-f3MAq-Pc8f3NoK.js";import"./react-vendor-CxebVPd2.js";import"./charting-CRteE9SO.js";import"./min-D09ly9DN-BlBWqrRP.js";import"./_baseUniq-DvG_IMU9-CU_a7b51.js";import"./init-DjUOC4st-DHuO7-vr.js";function oe(e,a){return a<e?-1:a>e?1:a>=e?0:NaN}function pe(e){return e}function ce(){var e=pe,a=oe,f=null,s=w(0),o=w(E),y=w(0);function l(t){var n,p=(t=ne(t)).length,d,v,m=0,c=new Array(p),r=new Array(p),x=+s.apply(this,arguments),S=Math.min(E,Math.max(-E,o.apply(this,arguments)-x)),h,A=Math.min(Math.abs(S)/p,y.apply(this,arguments)),b=A*(S<0?-1:1),g;for(n=0;n<p;++n)(g=r[c[n]=n]=+e(t[n],n,t))>0&&(m+=g);for(a!=null?c.sort(function($,T){return a(r[$],r[T])}):f!=null&&c.sort(function($,T){return f(t[$],t[T])}),n=0,v=m?(S-p*b)/m:0;n<p;++n,x=h)d=c[n],g=r[d],h=x+(g>0?g*v:0)+b,r[d]={data:t[d],index:n,value:g,startAngle:x,endAngle:h,padAngle:A};return r}return l.value=function(t){return arguments.length?(e=typeof t=="function"?t:w(+t),l):e},l.sortValues=function(t){return arguments.length?(a=t,f=null,l):a},l.sort=function(t){return arguments.length?(f=t,a=null,l):f},l.startAngle=function(t){return arguments.length?(s=typeof t=="function"?t:w(+t),l):s},l.endAngle=function(t){return arguments.length?(o=typeof t=="function"?t:w(+t),l):o},l.padAngle=function(t){return arguments.length?(y=typeof t=="function"?t:w(+t),l):y},l}var ue=ie.pie,F={sections:new Map,showData:!1},C=F.sections,Q=F.showData,de=structuredClone(ue),ge=u(()=>structuredClone(de),"getConfig"),fe=u(()=>{C=new Map,Q=F.showData,ae()},"clear"),he=u(({label:e,value:a})=>{if(a<0)throw new Error(`"${e}" has invalid value: ${a}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);C.has(e)||(C.set(e,a),O.debug(`added new section: ${e}, with value: ${a}`))},"addSection"),me=u(()=>C,"getSections"),xe=u(e=>{Q=e},"setShowData"),we=u(()=>Q,"getShowData"),V={getConfig:ge,clear:fe,setDiagramTitle:_,getDiagramTitle:Y,setAccTitle:X,getAccTitle:K,setAccDescription:J,getAccDescription:q,addSection:he,getSections:me,setShowData:xe,getShowData:we},ye=u((e,a)=>{re(e,a),a.setShowData(e.showData),e.sections.map(a.addSection)},"populateDb"),ve={parse:u(async e=>{const a=await le("pie",e);O.debug(a),ye(a,V)},"parse")},Se=u(e=>`
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
`,"getStyles"),$e=Se,Te=u(e=>{const a=[...e.values()].reduce((s,o)=>s+o,0),f=[...e.entries()].map(([s,o])=>({label:s,value:o})).filter(s=>s.value/a*100>=1).sort((s,o)=>o.value-s.value);return ce().value(s=>s.value)(f)},"createPieArcs"),Ae=u((e,a,f,s)=>{O.debug(`rendering pie chart
`+e);const o=s.db,y=j(),l=H(o.getConfig(),y.pie),t=40,n=18,p=4,d=450,v=d,m=I(a),c=m.append("g");c.attr("transform","translate("+v/2+","+d/2+")");const{themeVariables:r}=y;let[x]=ee(r.pieOuterStrokeWidth);x??=2;const S=l.textPosition,h=Math.min(v,d)/2-t,A=P().innerRadius(0).outerRadius(h),b=P().innerRadius(h*S).outerRadius(h*S);c.append("circle").attr("cx",0).attr("cy",0).attr("r",h+x/2).attr("class","pieOuterCircle");const g=o.getSections(),$=Te(g),T=[r.pie1,r.pie2,r.pie3,r.pie4,r.pie5,r.pie6,r.pie7,r.pie8,r.pie9,r.pie10,r.pie11,r.pie12];let D=0;g.forEach(i=>{D+=i});const R=$.filter(i=>(i.data.value/D*100).toFixed(0)!=="0"),k=se(T);c.selectAll("mySlices").data(R).enter().append("path").attr("d",A).attr("fill",i=>k(i.data.label)).attr("class","pieCircle"),c.selectAll("mySlices").data(R).enter().append("text").text(i=>(i.data.value/D*100).toFixed(0)+"%").attr("transform",i=>"translate("+b.centroid(i)+")").style("text-anchor","middle").attr("class","slice"),c.append("text").text(o.getDiagramTitle()).attr("x",0).attr("y",-400/2).attr("class","pieTitleText");const W=[...g.entries()].map(([i,z])=>({label:i,value:z})),M=c.selectAll(".legend").data(W).enter().append("g").attr("class","legend").attr("transform",(i,z)=>{const N=n+p,L=N*W.length/2,U=12*n,Z=z*N-L;return"translate("+U+","+Z+")"});M.append("rect").attr("width",n).attr("height",n).style("fill",i=>k(i.label)).style("stroke",i=>k(i.label)),M.append("text").attr("x",n+p).attr("y",n-p).text(i=>o.getShowData()?`${i.label} [${i.value}]`:i.label);const G=Math.max(...M.selectAll("text").nodes().map(i=>i?.getBoundingClientRect().width??0)),B=v+t+n+p+G;m.attr("viewBox",`0 0 ${B} ${d}`),te(m,d,B,l.useMaxWidth)},"draw"),be={draw:Ae},We={parser:ve,db:V,renderer:be,styles:$e};export{We as diagram};
