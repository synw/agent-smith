import{B as y,U as w,V as D,W as x,X as k,o as u,c as h,a as d,L as p,i as f,d as S,g as m,f as l,Y as g,$ as P,x as L,t as V}from"./index-vf8raKft.js";import{i as o}from"./state-Dz3mIamT.js";var E=function(t){var e=t.dt;return`
.p-slider {
    position: relative;
    background: `.concat(e("slider.track.background"),`;
    border-radius: `).concat(e("slider.track.border.radius"),`;
}

.p-slider-handle {
    cursor: grab;
    touch-action: none;
    display: flex;
    justify-content: center;
    align-items: center;
    height: `).concat(e("slider.handle.height"),`;
    width: `).concat(e("slider.handle.width"),`;
    background: `).concat(e("slider.handle.background"),`;
    border-radius: `).concat(e("slider.handle.border.radius"),`;
    transition: background `).concat(e("slider.transition.duration"),", color ").concat(e("slider.transition.duration"),", border-color ").concat(e("slider.transition.duration"),", box-shadow ").concat(e("slider.transition.duration"),", outline-color ").concat(e("slider.transition.duration"),`;
    outline-color: transparent;
}

.p-slider-handle::before {
    content: "";
    width: `).concat(e("slider.handle.content.width"),`;
    height: `).concat(e("slider.handle.content.height"),`;
    display: block;
    background: `).concat(e("slider.handle.content.background"),`;
    border-radius: `).concat(e("slider.handle.content.border.radius"),`;
    box-shadow: `).concat(e("slider.handle.content.shadow"),`;
    transition: background `).concat(e("slider.transition.duration"),`;
}

.p-slider:not(.p-disabled) .p-slider-handle:hover {
    background: `).concat(e("slider.handle.hover.background"),`;
}

.p-slider:not(.p-disabled) .p-slider-handle:hover::before {
    background: `).concat(e("slider.handle.content.hover.background"),`;
}

.p-slider-handle:focus-visible {
    box-shadow: `).concat(e("slider.handle.focus.ring.shadow"),`;
    outline: `).concat(e("slider.handle.focus.ring.width")," ").concat(e("slider.handle.focus.ring.style")," ").concat(e("slider.handle.focus.ring.color"),`;
    outline-offset: `).concat(e("slider.handle.focus.ring.offset"),`;
}

.p-slider-range {
    display: block;
    background: `).concat(e("slider.range.background"),`;
    border-radius: `).concat(e("slider.border.radius"),`;
}

.p-slider.p-slider-horizontal {
    height: `).concat(e("slider.track.size"),`;
}

.p-slider-horizontal .p-slider-range {
    inset-block-start: 0;
    inset-inline-start: 0;
    height: 100%;
}

.p-slider-horizontal .p-slider-handle {
    inset-block-start: 50%;
    margin-block-start: calc(-1 * calc(`).concat(e("slider.handle.height"),` / 2));
    margin-inline-start: calc(-1 * calc(`).concat(e("slider.handle.width"),` / 2));
}

.p-slider-vertical {
    min-height: 100px;
    width: `).concat(e("slider.track.size"),`;
}

.p-slider-vertical .p-slider-handle {
    inset-inline-start: 50%;
    margin-inline-start: calc(-1 * calc(`).concat(e("slider.handle.width"),` / 2));
    margin-block-end: calc(-1 * calc(`).concat(e("slider.handle.height"),` / 2));
}

.p-slider-vertical .p-slider-range {
    inset-block-end: 0;
    inset-inline-start: 0;
    width: 100%;
}
`)},B={handle:{position:"absolute"},range:{position:"absolute"}},T={root:function(t){var e=t.instance,i=t.props;return["p-slider p-component",{"p-disabled":i.disabled,"p-invalid":e.$invalid,"p-slider-horizontal":i.orientation==="horizontal","p-slider-vertical":i.orientation==="vertical"}]},range:"p-slider-range",handle:"p-slider-handle"},M=y.extend({name:"slider",theme:E,classes:T,inlineStyles:B}),I={name:"BaseSlider",extends:k,props:{min:{type:Number,default:0},max:{type:Number,default:100},orientation:{type:String,default:"horizontal"},step:{type:Number,default:null},range:{type:Boolean,default:!1},tabindex:{type:Number,default:0},ariaLabelledby:{type:String,default:null},ariaLabel:{type:String,default:null}},style:M,provide:function(){return{$pcSlider:this,$parentInstance:this}}};function A(n){return K(n)||C(n)||H(n)||z()}function z(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function H(n,t){if(n){if(typeof n=="string")return c(n,t);var e={}.toString.call(n).slice(8,-1);return e==="Object"&&n.constructor&&(e=n.constructor.name),e==="Map"||e==="Set"?Array.from(n):e==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?c(n,t):void 0}}function C(n){if(typeof Symbol<"u"&&n[Symbol.iterator]!=null||n["@@iterator"]!=null)return Array.from(n)}function K(n){if(Array.isArray(n))return c(n)}function c(n,t){(t==null||t>n.length)&&(t=n.length);for(var e=0,i=Array(t);e<t;e++)i[e]=n[e];return i}var v={name:"Slider",extends:I,inheritAttrs:!1,emits:["change","slideend"],dragging:!1,handleIndex:null,initX:null,initY:null,barWidth:null,barHeight:null,dragListener:null,dragEndListener:null,mutationObserver:null,data:function(){return{isRTL:!1}},beforeUnmount:function(){this.unbindDragListeners(),this.mutationObserver&&this.mutationObserver.disconnect()},mounted:function(){this.updateDirection(),this.observeDirectionChanges()},methods:{updateDomData:function(){var t=this.$el.getBoundingClientRect();this.initX=t.left+w(),this.initY=t.top+D(),this.barWidth=this.$el.offsetWidth,this.barHeight=this.$el.offsetHeight},setValue:function(t){var e,i=t.touches?t.touches[0].pageX:t.pageX,s=t.touches?t.touches[0].pageY:t.pageY;this.orientation==="horizontal"?this.isRTL?e=(this.initX+this.barWidth-i)*100/this.barWidth:e=(i-this.initX)*100/this.barWidth:e=(this.initY+this.barHeight-s)*100/this.barHeight;var r=(this.max-this.min)*(e/100)+this.min;if(this.step){var a=this.range?this.value[this.handleIndex]:this.value,b=r-a;b<0?r=a+Math.ceil(r/this.step-a/this.step)*this.step:b>0&&(r=a+Math.floor(r/this.step-a/this.step)*this.step)}else r=Math.floor(r);this.updateModel(t,r)},updateModel:function(t,e){var i=parseFloat(e.toFixed(10)),s;this.range?(s=this.value?A(this.value):[],this.handleIndex==0?(i<this.min?i=this.min:i>=this.max&&(i=this.max),s[0]=i):(i>this.max?i=this.max:i<=this.min&&(i=this.min),s[1]=i)):(i<this.min?i=this.min:i>this.max&&(i=this.max),s=i),this.writeValue(s,t),this.$emit("change",s)},onDragStart:function(t,e){this.disabled||(this.$el.setAttribute("data-p-sliding",!0),this.dragging=!0,this.updateDomData(),this.range&&this.value[0]===this.max?this.handleIndex=0:this.handleIndex=e,t.currentTarget.focus(),t.preventDefault())},onDrag:function(t){this.dragging&&(this.setValue(t),t.preventDefault())},onDragEnd:function(t){this.dragging&&(this.dragging=!1,this.$el.setAttribute("data-p-sliding",!1),this.$emit("slideend",{originalEvent:t,value:this.value}))},onBarClick:function(t){this.disabled||x(t.target,"data-pc-section")!=="handle"&&(this.updateDomData(),this.setValue(t))},onMouseDown:function(t,e){this.bindDragListeners(),this.onDragStart(t,e)},onKeyDown:function(t,e){switch(this.handleIndex=e,t.code){case"ArrowDown":case"ArrowLeft":this.decrementValue(t,e),t.preventDefault();break;case"ArrowUp":case"ArrowRight":this.incrementValue(t,e),t.preventDefault();break;case"PageDown":this.decrementValue(t,e,!0),t.preventDefault();break;case"PageUp":this.incrementValue(t,e,!0),t.preventDefault();break;case"Home":this.updateModel(t,this.min),t.preventDefault();break;case"End":this.updateModel(t,this.max),t.preventDefault();break}},onBlur:function(t,e){var i,s;(i=(s=this.formField).onBlur)===null||i===void 0||i.call(s,t)},decrementValue:function(t,e){var i=arguments.length>2&&arguments[2]!==void 0?arguments[2]:!1,s;this.range?this.step?s=this.value[e]-this.step:s=this.value[e]-1:this.step?s=this.value-this.step:!this.step&&i?s=this.value-10:s=this.value-1,this.updateModel(t,s),t.preventDefault()},incrementValue:function(t,e){var i=arguments.length>2&&arguments[2]!==void 0?arguments[2]:!1,s;this.range?this.step?s=this.value[e]+this.step:s=this.value[e]+1:this.step?s=this.value+this.step:!this.step&&i?s=this.value+10:s=this.value+1,this.updateModel(t,s),t.preventDefault()},bindDragListeners:function(){this.dragListener||(this.dragListener=this.onDrag.bind(this),document.addEventListener("mousemove",this.dragListener)),this.dragEndListener||(this.dragEndListener=this.onDragEnd.bind(this),document.addEventListener("mouseup",this.dragEndListener))},unbindDragListeners:function(){this.dragListener&&(document.removeEventListener("mousemove",this.dragListener),this.dragListener=null),this.dragEndListener&&(document.removeEventListener("mouseup",this.dragEndListener),this.dragEndListener=null)},rangeStyle:function(){if(this.range){var t=this.rangeEndPosition>this.rangeStartPosition?this.rangeEndPosition-this.rangeStartPosition:this.rangeStartPosition-this.rangeEndPosition,e=this.rangeEndPosition>this.rangeStartPosition?this.rangeStartPosition:this.rangeEndPosition;return this.horizontal?this.isRTL?{right:e+"%",width:t+"%"}:{left:e+"%",width:t+"%"}:{bottom:e+"%",height:t+"%"}}else return this.horizontal?{width:this.handlePosition+"%"}:{height:this.handlePosition+"%"}},handleStyle:function(){return this.horizontal?this.isRTL?{right:this.handlePosition+"%"}:{left:this.handlePosition+"%"}:{bottom:this.handlePosition+"%"}},rangeStartHandleStyle:function(){return this.horizontal?this.isRTL?{right:this.rangeStartPosition+"%"}:{left:this.rangeStartPosition+"%"}:{bottom:this.rangeStartPosition+"%"}},rangeEndHandleStyle:function(){return this.horizontal?this.isRTL?{right:this.rangeEndPosition+"%"}:{left:this.rangeEndPosition+"%"}:{bottom:this.rangeEndPosition+"%"}},updateDirection:function(){this.isRTL=!!this.$el.closest('[dir="rtl"]')},observeDirectionChanges:function(){var t=this,e=document.documentElement,i={attributes:!0,attributeFilter:["dir"]};this.mutationObserver=new MutationObserver(function(){t.updateDirection()}),this.mutationObserver.observe(e,i)}},computed:{value:function(){var t;if(this.range){var e,i,s,r;return[(e=(i=this.d_value)===null||i===void 0?void 0:i[0])!==null&&e!==void 0?e:this.min,(s=(r=this.d_value)===null||r===void 0?void 0:r[1])!==null&&s!==void 0?s:this.max]}return(t=this.d_value)!==null&&t!==void 0?t:this.min},horizontal:function(){return this.orientation==="horizontal"},vertical:function(){return this.orientation==="vertical"},handlePosition:function(){return this.value<this.min?0:this.value>this.max?100:(this.value-this.min)*100/(this.max-this.min)},rangeStartPosition:function(){return this.value&&this.value[0]?(this.value[0]<this.min?0:this.value[0]-this.min)*100/(this.max-this.min):0},rangeEndPosition:function(){return this.value&&this.value.length===2?(this.value[1]>this.max?100:this.value[1]-this.min)*100/(this.max-this.min):100}}},U=["tabindex","aria-valuemin","aria-valuenow","aria-valuemax","aria-labelledby","aria-label","aria-orientation"],R=["tabindex","aria-valuemin","aria-valuenow","aria-valuemax","aria-labelledby","aria-label","aria-orientation"],N=["tabindex","aria-valuemin","aria-valuenow","aria-valuemax","aria-labelledby","aria-label","aria-orientation"];function W(n,t,e,i,s,r){return u(),h("div",p({class:n.cx("root"),onClick:t[18]||(t[18]=function(){return r.onBarClick&&r.onBarClick.apply(r,arguments)})},n.ptmi("root"),{"data-p-sliding":!1}),[d("span",p({class:n.cx("range"),style:[n.sx("range"),r.rangeStyle()]},n.ptm("range")),null,16),n.range?f("",!0):(u(),h("span",p({key:0,class:n.cx("handle"),style:[n.sx("handle"),r.handleStyle()],onTouchstartPassive:t[0]||(t[0]=function(a){return r.onDragStart(a)}),onTouchmovePassive:t[1]||(t[1]=function(a){return r.onDrag(a)}),onTouchend:t[2]||(t[2]=function(a){return r.onDragEnd(a)}),onMousedown:t[3]||(t[3]=function(a){return r.onMouseDown(a)}),onKeydown:t[4]||(t[4]=function(a){return r.onKeyDown(a)}),onBlur:t[5]||(t[5]=function(a){return r.onBlur(a)}),tabindex:n.tabindex,role:"slider","aria-valuemin":n.min,"aria-valuenow":n.d_value,"aria-valuemax":n.max,"aria-labelledby":n.ariaLabelledby,"aria-label":n.ariaLabel,"aria-orientation":n.orientation},n.ptm("handle")),null,16,U)),n.range?(u(),h("span",p({key:1,class:n.cx("handle"),style:[n.sx("handle"),r.rangeStartHandleStyle()],onTouchstartPassive:t[6]||(t[6]=function(a){return r.onDragStart(a,0)}),onTouchmovePassive:t[7]||(t[7]=function(a){return r.onDrag(a)}),onTouchend:t[8]||(t[8]=function(a){return r.onDragEnd(a)}),onMousedown:t[9]||(t[9]=function(a){return r.onMouseDown(a,0)}),onKeydown:t[10]||(t[10]=function(a){return r.onKeyDown(a,0)}),onBlur:t[11]||(t[11]=function(a){return r.onBlur(a,0)}),tabindex:n.tabindex,role:"slider","aria-valuemin":n.min,"aria-valuenow":n.d_value?n.d_value[0]:null,"aria-valuemax":n.max,"aria-labelledby":n.ariaLabelledby,"aria-label":n.ariaLabel,"aria-orientation":n.orientation},n.ptm("startHandler")),null,16,R)):f("",!0),n.range?(u(),h("span",p({key:2,class:n.cx("handle"),style:[n.sx("handle"),r.rangeEndHandleStyle()],onTouchstartPassive:t[12]||(t[12]=function(a){return r.onDragStart(a,1)}),onTouchmovePassive:t[13]||(t[13]=function(a){return r.onDrag(a)}),onTouchend:t[14]||(t[14]=function(a){return r.onDragEnd(a)}),onMousedown:t[15]||(t[15]=function(a){return r.onMouseDown(a,1)}),onKeydown:t[16]||(t[16]=function(a){return r.onKeyDown(a,1)}),onBlur:t[17]||(t[17]=function(a){return r.onBlur(a,1)}),tabindex:n.tabindex,role:"slider","aria-valuemin":n.min,"aria-valuenow":n.d_value?n.d_value[1]:null,"aria-valuemax":n.max,"aria-labelledby":n.ariaLabelledby,"aria-label":n.ariaLabel,"aria-orientation":n.orientation},n.ptm("endHandler")),null,16,N)):f("",!0)],16)}v.render=W;const X={id:"params",class:"flex w-full flex-col max-w-[24rem]"},O={id:"pform",class:"grid w-full grid-cols-2 gap-x-3 gap-y-3 3xl:grid-cols-3"},Y={class:"flex flex-col"},F={key:0,class:"flex flex-col"},j={key:1,class:"flex flex-col"},q={key:2,class:"flex flex-col"},G={key:3,class:"flex flex-col"},J={key:4,class:"flex flex-col"},Q={class:"mt-8"},Z={class:"p-float-label"},$={class:"mr-8 mt-3"},_={class:"flex flex-row"},ee={class:"flex flex-grow justify-center p-3"},ie=S({__name:"InferParamsTab",setup(n){return(t,e)=>(u(),h("div",X,[d("div",O,[d("div",Y,[e[8]||(e[8]=d("label",{for:"temp",class:"txt-semilight"},"Temperature",-1)),m(l(g),{class:"w-8",modelValue:l(o).temperature,"onUpdate:modelValue":e[0]||(e[0]=i=>l(o).temperature=i),inputId:"temp",min:0,max:2,step:.1,showButtons:""},null,8,["modelValue"])]),l(o).tfs!=null?(u(),h("div",F,[e[9]||(e[9]=d("label",{for:"tfs",class:"txt-semilight"},"Tfs",-1)),m(l(g),{class:"w-8",modelValue:l(o).tfs,"onUpdate:modelValue":e[1]||(e[1]=i=>l(o).tfs=i),inputId:"tfs",min:0,max:2,step:.1,showButtons:""},null,8,["modelValue"])])):f("",!0),l(o).top_k!=null?(u(),h("div",j,[e[10]||(e[10]=d("label",{for:"topK",class:"txt-semilight"},"TopK",-1)),m(l(g),{class:"w-8",modelValue:l(o).top_k,"onUpdate:modelValue":e[2]||(e[2]=i=>l(o).top_k=i),inputId:"topK",min:0,max:100,showButtons:""},null,8,["modelValue"])])):f("",!0),l(o).top_p!=null?(u(),h("div",q,[e[11]||(e[11]=d("label",{for:"topP",class:"txt-semilight"},"TopP",-1)),m(l(g),{class:"w-8",modelValue:l(o).top_p,"onUpdate:modelValue":e[3]||(e[3]=i=>l(o).top_p=i),inputId:"topP",min:0,max:1,step:.05,showButtons:""},null,8,["modelValue"])])):f("",!0),l(o).min_p!=null?(u(),h("div",G,[e[12]||(e[12]=d("label",{for:"minP",class:"txt-semilight"},"MinP",-1)),m(l(g),{class:"w-8",modelValue:l(o).min_p,"onUpdate:modelValue":e[4]||(e[4]=i=>l(o).min_p=i),inputId:"minP",min:0,max:1,step:.05,showButtons:""},null,8,["modelValue"])])):f("",!0),l(o).repeat_penalty!=null?(u(),h("div",J,[e[13]||(e[13]=d("label",{for:"repeatPenalty",class:"txt-semilight"},"Repeat",-1)),m(l(g),{class:"w-8",modelValue:l(o).repeat_penalty,"onUpdate:modelValue":e[5]||(e[5]=i=>l(o).repeat_penalty=i),inputId:"repeatPenalty",min:0,max:2,step:.1,showButtons:""},null,8,["modelValue"])])):f("",!0)]),d("div",Q,[d("div",Z,[m(l(P),{inputId:"tokens",class:"hidden w-full"}),e[14]||(e[14]=d("label",{for:"tokens",class:"txt-semilight"},"Max tokens",-1))]),d("div",$,[m(l(v),{modelValue:l(o).max_tokens,"onUpdate:modelValue":e[6]||(e[6]=i=>l(o).max_tokens=i),class:"w-full",min:-1,max:l(L).ex.lm.model.ctx,onSlideend:e[7]||(e[7]=()=>{})},null,8,["modelValue","max"])]),d("div",_,[e[15]||(e[15]=d("div",{class:"p-3 txt-semilight"},"-1",-1)),d("div",ee,V(l(o).max_tokens),1)])])]))}});export{ie as _};
