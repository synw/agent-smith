import{B as w,V as x,U as k,W as S,X as P,Y as D,$ as V,c as u,o as h,a as d,h as f,L as g,d as L,g as m,f as l,a0 as p,a1 as E,x as B,t as M}from"./index-_xxmxxzb.js";import{i as o}from"./state-D9fL7LlU.js";var T=({dt:e})=>`
.p-slider {
    position: relative;
    background: ${e("slider.track.background")};
    border-radius: ${e("slider.track.border.radius")};
}

.p-slider-handle {
    cursor: grab;
    touch-action: none;
    user-select: none;
    display: flex;
    justify-content: center;
    align-items: center;
    height: ${e("slider.handle.height")};
    width: ${e("slider.handle.width")};
    background: ${e("slider.handle.background")};
    border-radius: ${e("slider.handle.border.radius")};
    transition: background ${e("slider.transition.duration")}, color ${e("slider.transition.duration")}, border-color ${e("slider.transition.duration")}, box-shadow ${e("slider.transition.duration")}, outline-color ${e("slider.transition.duration")};
    outline-color: transparent;
}

.p-slider-handle::before {
    content: "";
    width: ${e("slider.handle.content.width")};
    height: ${e("slider.handle.content.height")};
    display: block;
    background: ${e("slider.handle.content.background")};
    border-radius: ${e("slider.handle.content.border.radius")};
    box-shadow: ${e("slider.handle.content.shadow")};
    transition: background ${e("slider.transition.duration")};
}

.p-slider:not(.p-disabled) .p-slider-handle:hover {
    background: ${e("slider.handle.hover.background")};
}

.p-slider:not(.p-disabled) .p-slider-handle:hover::before {
    background: ${e("slider.handle.content.hover.background")};
}

.p-slider-handle:focus-visible {
    box-shadow: ${e("slider.handle.focus.ring.shadow")};
    outline: ${e("slider.handle.focus.ring.width")} ${e("slider.handle.focus.ring.style")} ${e("slider.handle.focus.ring.color")};
    outline-offset: ${e("slider.handle.focus.ring.offset")};
}

.p-slider-range {
    display: block;
    background: ${e("slider.range.background")};
    border-radius: ${e("slider.track.border.radius")};
}

.p-slider.p-slider-horizontal {
    height: ${e("slider.track.size")};
}

.p-slider-horizontal .p-slider-range {
    inset-block-start: 0;
    inset-inline-start: 0;
    height: 100%;
}

.p-slider-horizontal .p-slider-handle {
    inset-block-start: 50%;
    margin-block-start: calc(-1 * calc(${e("slider.handle.height")} / 2));
    margin-inline-start: calc(-1 * calc(${e("slider.handle.width")} / 2));
}

.p-slider-vertical {
    min-height: 100px;
    width: ${e("slider.track.size")};
}

.p-slider-vertical .p-slider-handle {
    inset-inline-start: 50%;
    margin-inline-start: calc(-1 * calc(${e("slider.handle.width")} / 2));
    margin-block-end: calc(-1 * calc(${e("slider.handle.height")} / 2));
}

.p-slider-vertical .p-slider-range {
    inset-block-end: 0;
    inset-inline-start: 0;
    width: 100%;
}
`,I={handle:{position:"absolute"},range:{position:"absolute"}},$={root:function(t){var n=t.instance,i=t.props;return["p-slider p-component",{"p-disabled":i.disabled,"p-invalid":n.$invalid,"p-slider-horizontal":i.orientation==="horizontal","p-slider-vertical":i.orientation==="vertical"}]},range:"p-slider-range",handle:"p-slider-handle"},A=w.extend({name:"slider",style:T,classes:$,inlineStyles:I}),z={name:"BaseSlider",extends:x,props:{min:{type:Number,default:0},max:{type:Number,default:100},orientation:{type:String,default:"horizontal"},step:{type:Number,default:null},range:{type:Boolean,default:!1},tabindex:{type:Number,default:0},ariaLabelledby:{type:String,default:null},ariaLabel:{type:String,default:null}},style:A,provide:function(){return{$pcSlider:this,$parentInstance:this}}};function b(e){"@babel/helpers - typeof";return b=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},b(e)}function H(e,t,n){return(t=K(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function K(e){var t=U(e,"string");return b(t)=="symbol"?t:t+""}function U(e,t){if(b(e)!="object"||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var i=n.call(e,t);if(b(i)!="object")return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}function C(e){return j(e)||X(e)||N(e)||W()}function W(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function N(e,t){if(e){if(typeof e=="string")return v(e,t);var n={}.toString.call(e).slice(8,-1);return n==="Object"&&e.constructor&&(n=e.constructor.name),n==="Map"||n==="Set"?Array.from(e):n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?v(e,t):void 0}}function X(e){if(typeof Symbol<"u"&&e[Symbol.iterator]!=null||e["@@iterator"]!=null)return Array.from(e)}function j(e){if(Array.isArray(e))return v(e)}function v(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,i=Array(t);n<t;n++)i[n]=e[n];return i}var y={name:"Slider",extends:z,inheritAttrs:!1,emits:["change","slideend"],dragging:!1,handleIndex:null,initX:null,initY:null,barWidth:null,barHeight:null,dragListener:null,dragEndListener:null,beforeUnmount:function(){this.unbindDragListeners()},methods:{updateDomData:function(){var t=this.$el.getBoundingClientRect();this.initX=t.left+D(),this.initY=t.top+V(),this.barWidth=this.$el.offsetWidth,this.barHeight=this.$el.offsetHeight},setValue:function(t){var n,i=t.touches?t.touches[0].pageX:t.pageX,s=t.touches?t.touches[0].pageY:t.pageY;this.orientation==="horizontal"?P(this.$el)?n=(this.initX+this.barWidth-i)*100/this.barWidth:n=(i-this.initX)*100/this.barWidth:n=(this.initY+this.barHeight-s)*100/this.barHeight;var a=(this.max-this.min)*(n/100)+this.min;if(this.step){var r=this.range?this.value[this.handleIndex]:this.value,c=a-r;c<0?a=r+Math.ceil(a/this.step-r/this.step)*this.step:c>0&&(a=r+Math.floor(a/this.step-r/this.step)*this.step)}else a=Math.floor(a);this.updateModel(t,a)},updateModel:function(t,n){var i=Math.round(n*100)/100,s;this.range?(s=this.value?C(this.value):[],this.handleIndex==0?(i<this.min?i=this.min:i>=this.max&&(i=this.max),s[0]=i):(i>this.max?i=this.max:i<=this.min&&(i=this.min),s[1]=i)):(i<this.min?i=this.min:i>this.max&&(i=this.max),s=i),this.writeValue(s,t),this.$emit("change",s)},onDragStart:function(t,n){this.disabled||(this.$el.setAttribute("data-p-sliding",!0),this.dragging=!0,this.updateDomData(),this.range&&this.value[0]===this.max?this.handleIndex=0:this.handleIndex=n,t.currentTarget.focus())},onDrag:function(t){this.dragging&&this.setValue(t)},onDragEnd:function(t){this.dragging&&(this.dragging=!1,this.$el.setAttribute("data-p-sliding",!1),this.$emit("slideend",{originalEvent:t,value:this.value}))},onBarClick:function(t){this.disabled||S(t.target,"data-pc-section")!=="handle"&&(this.updateDomData(),this.setValue(t))},onMouseDown:function(t,n){this.bindDragListeners(),this.onDragStart(t,n)},onKeyDown:function(t,n){switch(this.handleIndex=n,t.code){case"ArrowDown":case"ArrowLeft":this.decrementValue(t,n),t.preventDefault();break;case"ArrowUp":case"ArrowRight":this.incrementValue(t,n),t.preventDefault();break;case"PageDown":this.decrementValue(t,n,!0),t.preventDefault();break;case"PageUp":this.incrementValue(t,n,!0),t.preventDefault();break;case"Home":this.updateModel(t,this.min),t.preventDefault();break;case"End":this.updateModel(t,this.max),t.preventDefault();break}},onBlur:function(t,n){var i,s;(i=(s=this.formField).onBlur)===null||i===void 0||i.call(s,t)},decrementValue:function(t,n){var i=arguments.length>2&&arguments[2]!==void 0?arguments[2]:!1,s;this.range?this.step?s=this.value[n]-this.step:s=this.value[n]-1:this.step?s=this.value-this.step:!this.step&&i?s=this.value-10:s=this.value-1,this.updateModel(t,s),t.preventDefault()},incrementValue:function(t,n){var i=arguments.length>2&&arguments[2]!==void 0?arguments[2]:!1,s;this.range?this.step?s=this.value[n]+this.step:s=this.value[n]+1:this.step?s=this.value+this.step:!this.step&&i?s=this.value+10:s=this.value+1,this.updateModel(t,s),t.preventDefault()},bindDragListeners:function(){this.dragListener||(this.dragListener=this.onDrag.bind(this),document.addEventListener("mousemove",this.dragListener)),this.dragEndListener||(this.dragEndListener=this.onDragEnd.bind(this),document.addEventListener("mouseup",this.dragEndListener))},unbindDragListeners:function(){this.dragListener&&(document.removeEventListener("mousemove",this.dragListener),this.dragListener=null),this.dragEndListener&&(document.removeEventListener("mouseup",this.dragEndListener),this.dragEndListener=null)},rangeStyle:function(){if(this.range){var t=this.rangeEndPosition>this.rangeStartPosition?this.rangeEndPosition-this.rangeStartPosition:this.rangeStartPosition-this.rangeEndPosition,n=this.rangeEndPosition>this.rangeStartPosition?this.rangeStartPosition:this.rangeEndPosition;return this.horizontal?{"inset-inline-start":n+"%",width:t+"%"}:{bottom:n+"%",height:t+"%"}}else return this.horizontal?{width:this.handlePosition+"%"}:{height:this.handlePosition+"%"}},handleStyle:function(){return this.horizontal?{"inset-inline-start":this.handlePosition+"%"}:{bottom:this.handlePosition+"%"}},rangeStartHandleStyle:function(){return this.horizontal?{"inset-inline-start":this.rangeStartPosition+"%"}:{bottom:this.rangeStartPosition+"%"}},rangeEndHandleStyle:function(){return this.horizontal?{"inset-inline-start":this.rangeEndPosition+"%"}:{bottom:this.rangeEndPosition+"%"}}},computed:{value:function(){var t;if(this.range){var n,i,s,a;return[(n=(i=this.d_value)===null||i===void 0?void 0:i[0])!==null&&n!==void 0?n:this.min,(s=(a=this.d_value)===null||a===void 0?void 0:a[1])!==null&&s!==void 0?s:this.max]}return(t=this.d_value)!==null&&t!==void 0?t:this.min},horizontal:function(){return this.orientation==="horizontal"},vertical:function(){return this.orientation==="vertical"},handlePosition:function(){return this.value<this.min?0:this.value>this.max?100:(this.value-this.min)*100/(this.max-this.min)},rangeStartPosition:function(){return this.value&&this.value[0]!==void 0?this.value[0]<this.min?0:(this.value[0]-this.min)*100/(this.max-this.min):0},rangeEndPosition:function(){return this.value&&this.value.length===2&&this.value[1]!==void 0?this.value[1]>this.max?100:(this.value[1]-this.min)*100/(this.max-this.min):100},dataP:function(){return k(H({},this.orientation,this.orientation))}}},Y=["data-p"],R=["data-p"],F=["tabindex","aria-valuemin","aria-valuenow","aria-valuemax","aria-labelledby","aria-label","aria-orientation","data-p"],O=["tabindex","aria-valuemin","aria-valuenow","aria-valuemax","aria-labelledby","aria-label","aria-orientation","data-p"],q=["tabindex","aria-valuemin","aria-valuenow","aria-valuemax","aria-labelledby","aria-label","aria-orientation","data-p"];function G(e,t,n,i,s,a){return h(),u("div",g({class:e.cx("root"),onClick:t[18]||(t[18]=function(){return a.onBarClick&&a.onBarClick.apply(a,arguments)})},e.ptmi("root"),{"data-p-sliding":!1,"data-p":a.dataP}),[d("span",g({class:e.cx("range"),style:[e.sx("range"),a.rangeStyle()]},e.ptm("range"),{"data-p":a.dataP}),null,16,R),e.range?f("",!0):(h(),u("span",g({key:0,class:e.cx("handle"),style:[e.sx("handle"),a.handleStyle()],onTouchstartPassive:t[0]||(t[0]=function(r){return a.onDragStart(r)}),onTouchmovePassive:t[1]||(t[1]=function(r){return a.onDrag(r)}),onTouchend:t[2]||(t[2]=function(r){return a.onDragEnd(r)}),onMousedown:t[3]||(t[3]=function(r){return a.onMouseDown(r)}),onKeydown:t[4]||(t[4]=function(r){return a.onKeyDown(r)}),onBlur:t[5]||(t[5]=function(r){return a.onBlur(r)}),tabindex:e.tabindex,role:"slider","aria-valuemin":e.min,"aria-valuenow":e.d_value,"aria-valuemax":e.max,"aria-labelledby":e.ariaLabelledby,"aria-label":e.ariaLabel,"aria-orientation":e.orientation},e.ptm("handle"),{"data-p":a.dataP}),null,16,F)),e.range?(h(),u("span",g({key:1,class:e.cx("handle"),style:[e.sx("handle"),a.rangeStartHandleStyle()],onTouchstartPassive:t[6]||(t[6]=function(r){return a.onDragStart(r,0)}),onTouchmovePassive:t[7]||(t[7]=function(r){return a.onDrag(r)}),onTouchend:t[8]||(t[8]=function(r){return a.onDragEnd(r)}),onMousedown:t[9]||(t[9]=function(r){return a.onMouseDown(r,0)}),onKeydown:t[10]||(t[10]=function(r){return a.onKeyDown(r,0)}),onBlur:t[11]||(t[11]=function(r){return a.onBlur(r,0)}),tabindex:e.tabindex,role:"slider","aria-valuemin":e.min,"aria-valuenow":e.d_value?e.d_value[0]:null,"aria-valuemax":e.max,"aria-labelledby":e.ariaLabelledby,"aria-label":e.ariaLabel,"aria-orientation":e.orientation},e.ptm("startHandler"),{"data-p":a.dataP}),null,16,O)):f("",!0),e.range?(h(),u("span",g({key:2,class:e.cx("handle"),style:[e.sx("handle"),a.rangeEndHandleStyle()],onTouchstartPassive:t[12]||(t[12]=function(r){return a.onDragStart(r,1)}),onTouchmovePassive:t[13]||(t[13]=function(r){return a.onDrag(r)}),onTouchend:t[14]||(t[14]=function(r){return a.onDragEnd(r)}),onMousedown:t[15]||(t[15]=function(r){return a.onMouseDown(r,1)}),onKeydown:t[16]||(t[16]=function(r){return a.onKeyDown(r,1)}),onBlur:t[17]||(t[17]=function(r){return a.onBlur(r,1)}),tabindex:e.tabindex,role:"slider","aria-valuemin":e.min,"aria-valuenow":e.d_value?e.d_value[1]:null,"aria-valuemax":e.max,"aria-labelledby":e.ariaLabelledby,"aria-label":e.ariaLabel,"aria-orientation":e.orientation},e.ptm("endHandler"),{"data-p":a.dataP}),null,16,q)):f("",!0)],16,Y)}y.render=G;const J={id:"params",class:"flex w-full flex-col max-w-[24rem]"},Q={id:"pform",class:"grid w-full grid-cols-2 gap-x-3 gap-y-3 3xl:grid-cols-3"},Z={class:"flex flex-col"},_={key:0,class:"flex flex-col"},ee={key:1,class:"flex flex-col"},te={key:2,class:"flex flex-col"},ne={key:3,class:"flex flex-col"},ie={key:4,class:"flex flex-col"},ae={class:"mt-8"},re={class:"p-float-label"},se={class:"mr-8 mt-3"},le={class:"flex flex-row"},oe={class:"flex flex-grow justify-center p-3"},he=L({__name:"InferParamsTab",setup(e){return(t,n)=>(h(),u("div",J,[d("div",Q,[d("div",Z,[n[8]||(n[8]=d("label",{for:"temp",class:"txt-semilight"},"Temperature",-1)),m(l(p),{class:"w-8",modelValue:l(o).temperature,"onUpdate:modelValue":n[0]||(n[0]=i=>l(o).temperature=i),inputId:"temp",min:0,max:2,step:.1,showButtons:""},null,8,["modelValue"])]),l(o).tfs!=null?(h(),u("div",_,[n[9]||(n[9]=d("label",{for:"tfs",class:"txt-semilight"},"Tfs",-1)),m(l(p),{class:"w-8",modelValue:l(o).tfs,"onUpdate:modelValue":n[1]||(n[1]=i=>l(o).tfs=i),inputId:"tfs",min:0,max:2,step:.1,showButtons:""},null,8,["modelValue"])])):f("",!0),l(o).top_k!=null?(h(),u("div",ee,[n[10]||(n[10]=d("label",{for:"topK",class:"txt-semilight"},"TopK",-1)),m(l(p),{class:"w-8",modelValue:l(o).top_k,"onUpdate:modelValue":n[2]||(n[2]=i=>l(o).top_k=i),inputId:"topK",min:0,max:100,showButtons:""},null,8,["modelValue"])])):f("",!0),l(o).top_p!=null?(h(),u("div",te,[n[11]||(n[11]=d("label",{for:"topP",class:"txt-semilight"},"TopP",-1)),m(l(p),{class:"w-8",modelValue:l(o).top_p,"onUpdate:modelValue":n[3]||(n[3]=i=>l(o).top_p=i),inputId:"topP",min:0,max:1,step:.05,showButtons:""},null,8,["modelValue"])])):f("",!0),l(o).min_p!=null?(h(),u("div",ne,[n[12]||(n[12]=d("label",{for:"minP",class:"txt-semilight"},"MinP",-1)),m(l(p),{class:"w-8",modelValue:l(o).min_p,"onUpdate:modelValue":n[4]||(n[4]=i=>l(o).min_p=i),inputId:"minP",min:0,max:1,step:.05,showButtons:""},null,8,["modelValue"])])):f("",!0),l(o).repeat_penalty!=null?(h(),u("div",ie,[n[13]||(n[13]=d("label",{for:"repeatPenalty",class:"txt-semilight"},"Repeat",-1)),m(l(p),{class:"w-8",modelValue:l(o).repeat_penalty,"onUpdate:modelValue":n[5]||(n[5]=i=>l(o).repeat_penalty=i),inputId:"repeatPenalty",min:0,max:2,step:.1,showButtons:""},null,8,["modelValue"])])):f("",!0)]),d("div",ae,[d("div",re,[m(l(E),{inputId:"tokens",class:"hidden w-full"}),n[14]||(n[14]=d("label",{for:"tokens",class:"txt-semilight"},"Max tokens",-1))]),d("div",se,[m(l(y),{modelValue:l(o).max_tokens,"onUpdate:modelValue":n[6]||(n[6]=i=>l(o).max_tokens=i),class:"w-full",min:-1,max:l(B).ex.lm.model.ctx,onSlideend:n[7]||(n[7]=()=>{})},null,8,["modelValue","max"])]),d("div",le,[n[15]||(n[15]=d("div",{class:"p-3 txt-semilight"},"-1",-1)),d("div",oe,M(l(o).max_tokens),1)])])]))}});export{he as _};
