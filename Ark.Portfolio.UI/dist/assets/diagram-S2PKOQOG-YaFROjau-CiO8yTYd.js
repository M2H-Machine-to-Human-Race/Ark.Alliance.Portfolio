import{q as f,aB as m,aS as C,f as v,p as w,e as P,t as S,u as z,w as D,d as E,n as F,aC as T,aD as W,D as Q}from"./index-sJJkRNmh.js";import{t as A}from"./chunk-4BX2VUAB-C-8oH5OZ-BfsHuISQ.js";import{G as M}from"./treemap-KMMF4GRG-DkU9X3aX-uOGK8ve8.js";import"./markdown-D8NX56fe.js";import"./react-vendor-DabIWvu9.js";import"./mermaid-CVR_yEWu.js";import"./katex-XbL3y5x-.js";import"./min-D09ly9DN-BGStTWT7.js";import"./_baseUniq-DvG_IMU9-ChRGCy6e.js";var Y=W.packet,u,y=(u=class{constructor(){this.packet=[],this.setAccTitle=P,this.getAccTitle=S,this.setDiagramTitle=z,this.getDiagramTitle=D,this.getAccDescription=E,this.setAccDescription=F}getConfig(){const t=m({...Y,...T().packet});return t.showBits&&(t.paddingY+=10),t}getPacket(){return this.packet}pushWord(t){t.length>0&&this.packet.push(t)}clear(){Q(),this.packet=[]}},f(u,"PacketDB"),u),q=1e4,G=f((t,e)=>{A(t,e);let r=-1,o=[],n=1;const{bitsPerRow:l}=e.getConfig();for(let{start:a,end:s,bits:d,label:c}of t.blocks){if(a!==void 0&&s!==void 0&&s<a)throw new Error(`Packet block ${a} - ${s} is invalid. End must be greater than start.`);if(a??=r+1,a!==r+1)throw new Error(`Packet block ${a} - ${s??a} is not contiguous. It should start from ${r+1}.`);if(d===0)throw new Error(`Packet block ${a} is invalid. Cannot have a zero bit field.`);for(s??=a+(d??1)-1,d??=s-a+1,r=s,w.debug(`Packet block ${a} - ${r} with label ${c}`);o.length<=l+1&&e.getPacket().length<q;){const[p,i]=H({start:a,end:s,bits:d,label:c},n,l);if(o.push(p),p.end+1===n*l&&(e.pushWord(o),o=[],n++),!i)break;({start:a,end:s,bits:d,label:c}=i)}}e.pushWord(o)},"populate"),H=f((t,e,r)=>{if(t.start===void 0)throw new Error("start should have been set during first phase");if(t.end===void 0)throw new Error("end should have been set during first phase");if(t.start>t.end)throw new Error(`Block start ${t.start} is greater than block end ${t.end}.`);if(t.end+1<=e*r)return[t,void 0];const o=e*r-1,n=e*r;return[{start:t.start,end:o,label:t.label,bits:o-t.start},{start:n,end:t.end,label:t.label,bits:t.end-n}]},"getNextFittingBlock"),x={parser:{yy:void 0},parse:f(async t=>{const e=await M("packet",t),r=x.parser?.yy;if(!(r instanceof y))throw new Error("parser.parser?.yy was not a PacketDB. This is due to a bug within Mermaid, please report this issue at https://github.com/mermaid-js/mermaid/issues.");w.debug(e),G(e,r)},"parse")},L=f((t,e,r,o)=>{const n=o.db,l=n.getConfig(),{rowHeight:a,paddingY:s,bitWidth:d,bitsPerRow:c}=l,p=n.getPacket(),i=n.getDiagramTitle(),b=a+s,h=b*(p.length+1)-(i?0:a),k=d*c+2,g=C(e);g.attr("viewbox",`0 0 ${k} ${h}`),v(g,h,k,l.useMaxWidth);for(const[$,B]of p.entries())R(g,B,$,l);g.append("text").text(i).attr("x",k/2).attr("y",h-b/2).attr("dominant-baseline","middle").attr("text-anchor","middle").attr("class","packetTitle")},"draw"),R=f((t,e,r,{rowHeight:o,paddingX:n,paddingY:l,bitWidth:a,bitsPerRow:s,showBits:d})=>{const c=t.append("g"),p=r*(o+l)+l;for(const i of e){const b=i.start%s*a+1,h=(i.end-i.start+1)*a-n;if(c.append("rect").attr("x",b).attr("y",p).attr("width",h).attr("height",o).attr("class","packetBlock"),c.append("text").attr("x",b+h/2).attr("y",p+o/2).attr("class","packetLabel").attr("dominant-baseline","middle").attr("text-anchor","middle").text(i.label),!d)continue;const k=i.end===i.start,g=p-2;c.append("text").attr("x",b+(k?h/2:0)).attr("y",g).attr("class","packetByte start").attr("dominant-baseline","auto").attr("text-anchor",k?"middle":"start").text(i.start),k||c.append("text").attr("x",b+h).attr("y",g).attr("class","packetByte end").attr("dominant-baseline","auto").attr("text-anchor","end").text(i.end)}},"drawWord"),j={draw:L},I={byteFontSize:"10px",startByteColor:"black",endByteColor:"black",labelColor:"black",labelFontSize:"12px",titleColor:"black",titleFontSize:"14px",blockStrokeColor:"black",blockStrokeWidth:"1",blockFillColor:"#efefef"},X=f(({packet:t}={})=>{const e=m(I,t);return`
	.packetByte {
		font-size: ${e.byteFontSize};
	}
	.packetByte.start {
		fill: ${e.startByteColor};
	}
	.packetByte.end {
		fill: ${e.endByteColor};
	}
	.packetLabel {
		fill: ${e.labelColor};
		font-size: ${e.labelFontSize};
	}
	.packetTitle {
		fill: ${e.titleColor};
		font-size: ${e.titleFontSize};
	}
	.packetBlock {
		stroke: ${e.blockStrokeColor};
		stroke-width: ${e.blockStrokeWidth};
		fill: ${e.blockFillColor};
	}
	`},"styles"),et={parser:x,get db(){return new y},renderer:j,styles:X};export{et as diagram};
