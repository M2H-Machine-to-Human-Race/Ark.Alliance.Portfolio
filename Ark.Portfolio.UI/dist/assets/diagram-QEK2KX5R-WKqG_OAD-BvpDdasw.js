import{q as l,n as S,d as I,w as E,u as D,t as F,e as Q,aS as z,D as G,aB as v,aC as w,aD as P,p as R,b9 as B}from"./index-sJJkRNmh.js";import{t as j}from"./chunk-4BX2VUAB-C-8oH5OZ-BfsHuISQ.js";import{G as q}from"./treemap-KMMF4GRG-DkU9X3aX-uOGK8ve8.js";import"./markdown-D8NX56fe.js";import"./react-vendor-DabIWvu9.js";import"./mermaid-CVR_yEWu.js";import"./katex-XbL3y5x-.js";import"./min-D09ly9DN-BGStTWT7.js";import"./_baseUniq-DvG_IMU9-ChRGCy6e.js";var x={showLegend:!0,ticks:5,max:null,min:0,graticule:"circle"},b={axes:[],curves:[],options:x},h=structuredClone(b),K=P.radar,V=l(()=>v({...K,...w().radar}),"getConfig"),M=l(()=>h.axes,"getAxes"),W=l(()=>h.curves,"getCurves"),Z=l(()=>h.options,"getOptions"),J=l(a=>{h.axes=a.map(t=>({name:t.name,label:t.label??t.name}))},"setAxes"),U=l(a=>{h.curves=a.map(t=>({name:t.name,label:t.label??t.name,entries:_(t.entries)}))},"setCurves"),_=l(a=>{if(a[0].axis==null)return a.map(e=>e.value);const t=M();if(t.length===0)throw new Error("Axes must be populated before curves for reference entries");return t.map(e=>{const r=a.find(s=>s.axis?.$refText===e.name);if(r===void 0)throw new Error("Missing entry for axis "+e.label);return r.value})},"computeCurveEntries"),H=l(a=>{const t=a.reduce((e,r)=>(e[r.name]=r,e),{});h.options={showLegend:t.showLegend?.value??x.showLegend,ticks:t.ticks?.value??x.ticks,max:t.max?.value??x.max,min:t.min?.value??x.min,graticule:t.graticule?.value??x.graticule}},"setOptions"),N=l(()=>{G(),h=structuredClone(b)},"clear"),f={getAxes:M,getCurves:W,getOptions:Z,setAxes:J,setCurves:U,setOptions:H,getConfig:V,clear:N,setAccTitle:Q,getAccTitle:F,setDiagramTitle:D,getDiagramTitle:E,getAccDescription:I,setAccDescription:S},X=l(a=>{j(a,f);const{axes:t,curves:e,options:r}=a;f.setAxes(t),f.setCurves(e),f.setOptions(r)},"populate"),Y={parse:l(async a=>{const t=await q("radar",a);R.debug(t),X(t)},"parse")},tt=l((a,t,e,r)=>{const s=r.db,n=s.getAxes(),o=s.getCurves(),i=s.getOptions(),c=s.getConfig(),d=s.getDiagramTitle(),g=z(t),p=et(g,c),u=i.max??Math.max(...o.map(y=>Math.max(...y.entries))),m=i.min,$=Math.min(c.width,c.height)/2;at(p,n,$,i.ticks,i.graticule),rt(p,n,$,c),C(p,n,o,m,u,i.graticule,c),A(p,o,i.showLegend,c),p.append("text").attr("class","radarTitle").text(d).attr("x",0).attr("y",-c.height/2-c.marginTop)},"draw"),et=l((a,t)=>{const e=t.width+t.marginLeft+t.marginRight,r=t.height+t.marginTop+t.marginBottom,s={x:t.marginLeft+t.width/2,y:t.marginTop+t.height/2};return a.attr("viewbox",`0 0 ${e} ${r}`).attr("width",e).attr("height",r),a.append("g").attr("transform",`translate(${s.x}, ${s.y})`)},"drawFrame"),at=l((a,t,e,r,s)=>{if(s==="circle")for(let n=0;n<r;n++){const o=e*(n+1)/r;a.append("circle").attr("r",o).attr("class","radarGraticule")}else if(s==="polygon"){const n=t.length;for(let o=0;o<r;o++){const i=e*(o+1)/r,c=t.map((d,g)=>{const p=2*g*Math.PI/n-Math.PI/2,u=i*Math.cos(p),m=i*Math.sin(p);return`${u},${m}`}).join(" ");a.append("polygon").attr("points",c).attr("class","radarGraticule")}}},"drawGraticule"),rt=l((a,t,e,r)=>{const s=t.length;for(let n=0;n<s;n++){const o=t[n].label,i=2*n*Math.PI/s-Math.PI/2;a.append("line").attr("x1",0).attr("y1",0).attr("x2",e*r.axisScaleFactor*Math.cos(i)).attr("y2",e*r.axisScaleFactor*Math.sin(i)).attr("class","radarAxisLine"),a.append("text").text(o).attr("x",e*r.axisLabelFactor*Math.cos(i)).attr("y",e*r.axisLabelFactor*Math.sin(i)).attr("class","radarAxisLabel")}},"drawAxes");function C(a,t,e,r,s,n,o){const i=t.length,c=Math.min(o.width,o.height)/2;e.forEach((d,g)=>{if(d.entries.length!==i)return;const p=d.entries.map((u,m)=>{const $=2*Math.PI*m/i-Math.PI/2,y=L(u,r,s,c),k=y*Math.cos($),O=y*Math.sin($);return{x:k,y:O}});n==="circle"?a.append("path").attr("d",T(p,o.curveTension)).attr("class",`radarCurve-${g}`):n==="polygon"&&a.append("polygon").attr("points",p.map(u=>`${u.x},${u.y}`).join(" ")).attr("class",`radarCurve-${g}`)})}l(C,"drawCurves");function L(a,t,e,r){const s=Math.min(Math.max(a,t),e);return r*(s-t)/(e-t)}l(L,"relativeRadius");function T(a,t){const e=a.length;let r=`M${a[0].x},${a[0].y}`;for(let s=0;s<e;s++){const n=a[(s-1+e)%e],o=a[s],i=a[(s+1)%e],c=a[(s+2)%e],d={x:o.x+(i.x-n.x)*t,y:o.y+(i.y-n.y)*t},g={x:i.x-(c.x-o.x)*t,y:i.y-(c.y-o.y)*t};r+=` C${d.x},${d.y} ${g.x},${g.y} ${i.x},${i.y}`}return`${r} Z`}l(T,"closedRoundCurve");function A(a,t,e,r){if(!e)return;const s=(r.width/2+r.marginRight)*3/4,n=-(r.height/2+r.marginTop)*3/4,o=20;t.forEach((i,c)=>{const d=a.append("g").attr("transform",`translate(${s}, ${n+c*o})`);d.append("rect").attr("width",12).attr("height",12).attr("class",`radarLegendBox-${c}`),d.append("text").attr("x",16).attr("y",0).attr("class","radarLegendText").text(i.label)})}l(A,"drawLegend");var st={draw:tt},it=l((a,t)=>{let e="";for(let r=0;r<a.THEME_COLOR_LIMIT;r++){const s=a[`cScale${r}`];e+=`
		.radarCurve-${r} {
			color: ${s};
			fill: ${s};
			fill-opacity: ${t.curveOpacity};
			stroke: ${s};
			stroke-width: ${t.curveStrokeWidth};
		}
		.radarLegendBox-${r} {
			fill: ${s};
			fill-opacity: ${t.curveOpacity};
			stroke: ${s};
		}
		`}return e},"genIndexStyles"),nt=l(a=>{const t=B(),e=w(),r=v(t,e.themeVariables),s=v(r.radar,a);return{themeVariables:r,radarOptions:s}},"buildRadarStyleOptions"),ot=l(({radar:a}={})=>{const{themeVariables:t,radarOptions:e}=nt(a);return`
	.radarTitle {
		font-size: ${t.fontSize};
		color: ${t.titleColor};
		dominant-baseline: hanging;
		text-anchor: middle;
	}
	.radarAxisLine {
		stroke: ${e.axisColor};
		stroke-width: ${e.axisStrokeWidth};
	}
	.radarAxisLabel {
		dominant-baseline: middle;
		text-anchor: middle;
		font-size: ${e.axisLabelFontSize}px;
		color: ${e.axisColor};
	}
	.radarGraticule {
		fill: ${e.graticuleColor};
		fill-opacity: ${e.graticuleOpacity};
		stroke: ${e.graticuleColor};
		stroke-width: ${e.graticuleStrokeWidth};
	}
	.radarLegendText {
		text-anchor: start;
		font-size: ${e.legendFontSize}px;
		dominant-baseline: hanging;
	}
	${it(t,e)}
	`},"styles"),$t={parser:Y,db:f,renderer:st,styles:ot};export{$t as diagram};
