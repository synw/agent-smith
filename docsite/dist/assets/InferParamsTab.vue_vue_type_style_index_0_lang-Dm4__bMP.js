import{B as w,V as x,T as k,X as P,Y as S,Z as D,$ as V,c as u,o as h,a as d,h as f,K as g,d as E,g as m,f as l,a0 as p,a1 as L,x as B,t as M}from"./index-om70ZWGg.js";import{i as o}from"./state-CNKoQZsd.js";var T=`
    .p-slider {
        display: block;
        position: relative;
        background: dt('slider.track.background');
        border-radius: dt('slider.track.border.radius');
    }

    .p-slider-handle {
        cursor: grab;
        touch-action: none;
        user-select: none;
        display: flex;
        justify-content: center;
        align-items: center;
        height: dt('slider.handle.height');
        width: dt('slider.handle.width');
        background: dt('slider.handle.background');
        border-radius: dt('slider.handle.border.radius');
        transition:
            background dt('slider.transition.duration'),
            color dt('slider.transition.duration'),
            border-color dt('slider.transition.duration'),
            box-shadow dt('slider.transition.duration'),
            outline-color dt('slider.transition.duration');
        outline-color: transparent;
    }

    .p-slider-handle::before {
        content: '';
        width: dt('slider.handle.content.width');
        height: dt('slider.handle.content.height');
        display: block;
        background: dt('slider.handle.content.background');
        border-radius: dt('slider.handle.content.border.radius');
        box-shadow: dt('slider.handle.content.shadow');
        transition: background dt('slider.transition.duration');
    }

    .p-slider:not(.p-disabled) .p-slider-handle:hover {
        background: dt('slider.handle.hover.background');
    }

    .p-slider:not(.p-disabled) .p-slider-handle:hover::before {
        background: dt('slider.handle.content.hover.background');
    }

    .p-slider-handle:focus-visible {
        box-shadow: dt('slider.handle.focus.ring.shadow');
        outline: dt('slider.handle.focus.ring.width') dt('slider.handle.focus.ring.style') dt('slider.handle.focus.ring.color');
        outline-offset: dt('slider.handle.focus.ring.offset');
    }

    .p-slider-range {
        display: block;
        background: dt('slider.range.background');
        border-radius: dt('slider.track.border.radius');
    }

    .p-slider.p-slider-horizontal {
        height: dt('slider.track.size');
    }

    .p-slider-horizontal .p-slider-range {
        inset-block-start: 0;
        inset-inline-start: 0;
        height: 100%;
    }

    .p-slider-horizontal .p-slider-handle {
        inset-block-start: 50%;
        margin-block-start: calc(-1 * calc(dt('slider.handle.height') / 2));
        margin-inline-start: calc(-1 * calc(dt('slider.handle.width') / 2));
    }

    .p-slider-vertical {
        min-height: 100px;
        width: dt('slider.track.size');
    }

    .p-slider-vertical .p-slider-handle {
        inset-inline-start: 50%;
        margin-inline-start: calc(-1 * calc(dt('slider.handle.width') / 2));
        margin-block-end: calc(-1 * calc(dt('slider.handle.height') / 2));
    }

    .p-slider-vertical .p-slider-range {
        inset-block-end: 0;
        inset-inline-start: 0;
        width: 100%;
    }
`,I={handle:{position:"absolute"},range:{position:"absolute"}},A={root:function(e){var n=e.instance,i=e.props;return["p-slider p-component",{"p-disabled":i.disabled,"p-invalid":n.$invalid,"p-slider-horizontal":i.orientation==="horizontal","p-slider-vertical":i.orientation==="vertical"}]},range:"p-slider-range",handle:"p-slider-handle"},z=w.extend({name:"slider",style:T,classes:A,inlineStyles:I}),H={name:"BaseSlider",extends:x,props:{min:{type:Number,default:0},max:{type:Number,default:100},orientation:{type:String,default:"horizontal"},step:{type:Number,default:null},range:{type:Boolean,default:!1},tabindex:{type:Number,default:0},ariaLabelledby:{type:String,default:null},ariaLabel:{type:String,default:null}},style:z,provide:function(){return{$pcSlider:this,$parentInstance:this}}};function b(t){"@babel/helpers - typeof";return b=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},b(t)}function K(t,e,n){return(e=U(e))in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function U(t){var e=C(t,"string");return b(e)=="symbol"?e:e+""}function C(t,e){if(b(t)!="object"||!t)return t;var n=t[Symbol.toPrimitive];if(n!==void 0){var i=n.call(t,e);if(b(i)!="object")return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}function N(t){return W(t)||Y(t)||j(t)||X()}function X(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function j(t,e){if(t){if(typeof t=="string")return v(t,e);var n={}.toString.call(t).slice(8,-1);return n==="Object"&&t.constructor&&(n=t.constructor.name),n==="Map"||n==="Set"?Array.from(t):n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?v(t,e):void 0}}function Y(t){if(typeof Symbol<"u"&&t[Symbol.iterator]!=null||t["@@iterator"]!=null)return Array.from(t)}function W(t){if(Array.isArray(t))return v(t)}function v(t,e){(e==null||e>t.length)&&(e=t.length);for(var n=0,i=Array(e);n<e;n++)i[n]=t[n];return i}var y={name:"Slider",extends:H,inheritAttrs:!1,emits:["change","slideend"],dragging:!1,handleIndex:null,initX:null,initY:null,barWidth:null,barHeight:null,dragListener:null,dragEndListener:null,beforeUnmount:function(){this.unbindDragListeners()},methods:{updateDomData:function(){var e=this.$el.getBoundingClientRect();this.initX=e.left+D(),this.initY=e.top+V(),this.barWidth=this.$el.offsetWidth,this.barHeight=this.$el.offsetHeight},setValue:function(e){var n,i=e.touches?e.touches[0].pageX:e.pageX,s=e.touches?e.touches[0].pageY:e.pageY;this.orientation==="horizontal"?S(this.$el)?n=(this.initX+this.barWidth-i)*100/this.barWidth:n=(i-this.initX)*100/this.barWidth:n=(this.initY+this.barHeight-s)*100/this.barHeight;var a=(this.max-this.min)*(n/100)+this.min;if(this.step){var r=this.range?this.value[this.handleIndex]:this.value,c=a-r;c<0?a=r+Math.ceil(a/this.step-r/this.step)*this.step:c>0&&(a=r+Math.floor(a/this.step-r/this.step)*this.step)}else a=Math.floor(a);this.updateModel(e,a)},updateModel:function(e,n){var i=Math.round(n*100)/100,s;this.range?(s=this.value?N(this.value):[],this.handleIndex==0?(i<this.min?i=this.min:i>=this.max&&(i=this.max),s[0]=i):(i>this.max?i=this.max:i<=this.min&&(i=this.min),s[1]=i)):(i<this.min?i=this.min:i>this.max&&(i=this.max),s=i),this.writeValue(s,e),this.$emit("change",s)},onDragStart:function(e,n){this.disabled||(this.$el.setAttribute("data-p-sliding",!0),this.dragging=!0,this.updateDomData(),this.range&&this.value[0]===this.max?this.handleIndex=0:this.handleIndex=n,e.currentTarget.focus())},onDrag:function(e){this.dragging&&this.setValue(e)},onDragEnd:function(e){this.dragging&&(this.dragging=!1,this.$el.setAttribute("data-p-sliding",!1),this.$emit("slideend",{originalEvent:e,value:this.value}))},onBarClick:function(e){this.disabled||P(e.target,"data-pc-section")!=="handle"&&(this.updateDomData(),this.setValue(e))},onMouseDown:function(e,n){this.bindDragListeners(),this.onDragStart(e,n)},onKeyDown:function(e,n){switch(this.handleIndex=n,e.code){case"ArrowDown":case"ArrowLeft":this.decrementValue(e,n),e.preventDefault();break;case"ArrowUp":case"ArrowRight":this.incrementValue(e,n),e.preventDefault();break;case"PageDown":this.decrementValue(e,n,!0),e.preventDefault();break;case"PageUp":this.incrementValue(e,n,!0),e.preventDefault();break;case"Home":this.updateModel(e,this.min),e.preventDefault();break;case"End":this.updateModel(e,this.max),e.preventDefault();break}},onBlur:function(e,n){var i,s;(i=(s=this.formField).onBlur)===null||i===void 0||i.call(s,e)},decrementValue:function(e,n){var i=arguments.length>2&&arguments[2]!==void 0?arguments[2]:!1,s;this.range?this.step?s=this.value[n]-this.step:s=this.value[n]-1:this.step?s=this.value-this.step:!this.step&&i?s=this.value-10:s=this.value-1,this.updateModel(e,s),e.preventDefault()},incrementValue:function(e,n){var i=arguments.length>2&&arguments[2]!==void 0?arguments[2]:!1,s;this.range?this.step?s=this.value[n]+this.step:s=this.value[n]+1:this.step?s=this.value+this.step:!this.step&&i?s=this.value+10:s=this.value+1,this.updateModel(e,s),e.preventDefault()},bindDragListeners:function(){this.dragListener||(this.dragListener=this.onDrag.bind(this),document.addEventListener("mousemove",this.dragListener)),this.dragEndListener||(this.dragEndListener=this.onDragEnd.bind(this),document.addEventListener("mouseup",this.dragEndListener))},unbindDragListeners:function(){this.dragListener&&(document.removeEventListener("mousemove",this.dragListener),this.dragListener=null),this.dragEndListener&&(document.removeEventListener("mouseup",this.dragEndListener),this.dragEndListener=null)},rangeStyle:function(){if(this.range){var e=this.rangeEndPosition>this.rangeStartPosition?this.rangeEndPosition-this.rangeStartPosition:this.rangeStartPosition-this.rangeEndPosition,n=this.rangeEndPosition>this.rangeStartPosition?this.rangeStartPosition:this.rangeEndPosition;return this.horizontal?{"inset-inline-start":n+"%",width:e+"%"}:{bottom:n+"%",height:e+"%"}}else return this.horizontal?{width:this.handlePosition+"%"}:{height:this.handlePosition+"%"}},handleStyle:function(){return this.horizontal?{"inset-inline-start":this.handlePosition+"%"}:{bottom:this.handlePosition+"%"}},rangeStartHandleStyle:function(){return this.horizontal?{"inset-inline-start":this.rangeStartPosition+"%"}:{bottom:this.rangeStartPosition+"%"}},rangeEndHandleStyle:function(){return this.horizontal?{"inset-inline-start":this.rangeEndPosition+"%"}:{bottom:this.rangeEndPosition+"%"}}},computed:{value:function(){var e;if(this.range){var n,i,s,a;return[(n=(i=this.d_value)===null||i===void 0?void 0:i[0])!==null&&n!==void 0?n:this.min,(s=(a=this.d_value)===null||a===void 0?void 0:a[1])!==null&&s!==void 0?s:this.max]}return(e=this.d_value)!==null&&e!==void 0?e:this.min},horizontal:function(){return this.orientation==="horizontal"},vertical:function(){return this.orientation==="vertical"},handlePosition:function(){return this.value<this.min?0:this.value>this.max?100:(this.value-this.min)*100/(this.max-this.min)},rangeStartPosition:function(){return this.value&&this.value[0]!==void 0?this.value[0]<this.min?0:(this.value[0]-this.min)*100/(this.max-this.min):0},rangeEndPosition:function(){return this.value&&this.value.length===2&&this.value[1]!==void 0?this.value[1]>this.max?100:(this.value[1]-this.min)*100/(this.max-this.min):100},dataP:function(){return k(K({},this.orientation,this.orientation))}}},F=["data-p"],R=["data-p"],O=["tabindex","aria-valuemin","aria-valuenow","aria-valuemax","aria-labelledby","aria-label","aria-orientation","data-p"],Q=["tabindex","aria-valuemin","aria-valuenow","aria-valuemax","aria-labelledby","aria-label","aria-orientation","data-p"],Z=["tabindex","aria-valuemin","aria-valuenow","aria-valuemax","aria-labelledby","aria-label","aria-orientation","data-p"];function q(t,e,n,i,s,a){return h(),u("div",g({class:t.cx("root"),onClick:e[18]||(e[18]=function(){return a.onBarClick&&a.onBarClick.apply(a,arguments)})},t.ptmi("root"),{"data-p-sliding":!1,"data-p":a.dataP}),[d("span",g({class:t.cx("range"),style:[t.sx("range"),a.rangeStyle()]},t.ptm("range"),{"data-p":a.dataP}),null,16,R),t.range?f("",!0):(h(),u("span",g({key:0,class:t.cx("handle"),style:[t.sx("handle"),a.handleStyle()],onTouchstartPassive:e[0]||(e[0]=function(r){return a.onDragStart(r)}),onTouchmovePassive:e[1]||(e[1]=function(r){return a.onDrag(r)}),onTouchend:e[2]||(e[2]=function(r){return a.onDragEnd(r)}),onMousedown:e[3]||(e[3]=function(r){return a.onMouseDown(r)}),onKeydown:e[4]||(e[4]=function(r){return a.onKeyDown(r)}),onBlur:e[5]||(e[5]=function(r){return a.onBlur(r)}),tabindex:t.tabindex,role:"slider","aria-valuemin":t.min,"aria-valuenow":t.d_value,"aria-valuemax":t.max,"aria-labelledby":t.ariaLabelledby,"aria-label":t.ariaLabel,"aria-orientation":t.orientation},t.ptm("handle"),{"data-p":a.dataP}),null,16,O)),t.range?(h(),u("span",g({key:1,class:t.cx("handle"),style:[t.sx("handle"),a.rangeStartHandleStyle()],onTouchstartPassive:e[6]||(e[6]=function(r){return a.onDragStart(r,0)}),onTouchmovePassive:e[7]||(e[7]=function(r){return a.onDrag(r)}),onTouchend:e[8]||(e[8]=function(r){return a.onDragEnd(r)}),onMousedown:e[9]||(e[9]=function(r){return a.onMouseDown(r,0)}),onKeydown:e[10]||(e[10]=function(r){return a.onKeyDown(r,0)}),onBlur:e[11]||(e[11]=function(r){return a.onBlur(r,0)}),tabindex:t.tabindex,role:"slider","aria-valuemin":t.min,"aria-valuenow":t.d_value?t.d_value[0]:null,"aria-valuemax":t.max,"aria-labelledby":t.ariaLabelledby,"aria-label":t.ariaLabel,"aria-orientation":t.orientation},t.ptm("startHandler"),{"data-p":a.dataP}),null,16,Q)):f("",!0),t.range?(h(),u("span",g({key:2,class:t.cx("handle"),style:[t.sx("handle"),a.rangeEndHandleStyle()],onTouchstartPassive:e[12]||(e[12]=function(r){return a.onDragStart(r,1)}),onTouchmovePassive:e[13]||(e[13]=function(r){return a.onDrag(r)}),onTouchend:e[14]||(e[14]=function(r){return a.onDragEnd(r)}),onMousedown:e[15]||(e[15]=function(r){return a.onMouseDown(r,1)}),onKeydown:e[16]||(e[16]=function(r){return a.onKeyDown(r,1)}),onBlur:e[17]||(e[17]=function(r){return a.onBlur(r,1)}),tabindex:t.tabindex,role:"slider","aria-valuemin":t.min,"aria-valuenow":t.d_value?t.d_value[1]:null,"aria-valuemax":t.max,"aria-labelledby":t.ariaLabelledby,"aria-label":t.ariaLabel,"aria-orientation":t.orientation},t.ptm("endHandler"),{"data-p":a.dataP}),null,16,Z)):f("",!0)],16,F)}y.render=q;const G={id:"params",class:"flex w-full flex-col max-w-[24rem]"},J={id:"pform",class:"grid w-full grid-cols-2 gap-x-3 gap-y-3 3xl:grid-cols-3"},$={class:"flex flex-col"},_={key:0,class:"flex flex-col"},ee={key:1,class:"flex flex-col"},te={key:2,class:"flex flex-col"},ne={key:3,class:"flex flex-col"},ie={key:4,class:"flex flex-col"},ae={class:"mt-8"},re={class:"p-float-label"},se={class:"mr-8 mt-3"},le={class:"flex flex-row"},oe={class:"flex flex-grow justify-center p-3"},he=E({__name:"InferParamsTab",setup(t){return(e,n)=>(h(),u("div",G,[d("div",J,[d("div",$,[n[8]||(n[8]=d("label",{for:"temp",class:"txt-semilight"},"Temperature",-1)),m(l(p),{class:"w-8",modelValue:l(o).temperature,"onUpdate:modelValue":n[0]||(n[0]=i=>l(o).temperature=i),inputId:"temp",min:0,max:2,step:.1,showButtons:""},null,8,["modelValue"])]),l(o).tfs!=null?(h(),u("div",_,[n[9]||(n[9]=d("label",{for:"tfs",class:"txt-semilight"},"Tfs",-1)),m(l(p),{class:"w-8",modelValue:l(o).tfs,"onUpdate:modelValue":n[1]||(n[1]=i=>l(o).tfs=i),inputId:"tfs",min:0,max:2,step:.1,showButtons:""},null,8,["modelValue"])])):f("",!0),l(o).top_k!=null?(h(),u("div",ee,[n[10]||(n[10]=d("label",{for:"topK",class:"txt-semilight"},"TopK",-1)),m(l(p),{class:"w-8",modelValue:l(o).top_k,"onUpdate:modelValue":n[2]||(n[2]=i=>l(o).top_k=i),inputId:"topK",min:0,max:100,showButtons:""},null,8,["modelValue"])])):f("",!0),l(o).top_p!=null?(h(),u("div",te,[n[11]||(n[11]=d("label",{for:"topP",class:"txt-semilight"},"TopP",-1)),m(l(p),{class:"w-8",modelValue:l(o).top_p,"onUpdate:modelValue":n[3]||(n[3]=i=>l(o).top_p=i),inputId:"topP",min:0,max:1,step:.05,showButtons:""},null,8,["modelValue"])])):f("",!0),l(o).min_p!=null?(h(),u("div",ne,[n[12]||(n[12]=d("label",{for:"minP",class:"txt-semilight"},"MinP",-1)),m(l(p),{class:"w-8",modelValue:l(o).min_p,"onUpdate:modelValue":n[4]||(n[4]=i=>l(o).min_p=i),inputId:"minP",min:0,max:1,step:.05,showButtons:""},null,8,["modelValue"])])):f("",!0),l(o).repeat_penalty!=null?(h(),u("div",ie,[n[13]||(n[13]=d("label",{for:"repeatPenalty",class:"txt-semilight"},"Repeat",-1)),m(l(p),{class:"w-8",modelValue:l(o).repeat_penalty,"onUpdate:modelValue":n[5]||(n[5]=i=>l(o).repeat_penalty=i),inputId:"repeatPenalty",min:0,max:2,step:.1,showButtons:""},null,8,["modelValue"])])):f("",!0)]),d("div",ae,[d("div",re,[m(l(L),{inputId:"tokens",class:"hidden w-full"}),n[14]||(n[14]=d("label",{for:"tokens",class:"txt-semilight"},"Max tokens",-1))]),d("div",se,[m(l(y),{modelValue:l(o).max_tokens,"onUpdate:modelValue":n[6]||(n[6]=i=>l(o).max_tokens=i),class:"w-full",min:-1,max:l(B).ex.lm.model.ctx,onSlideend:n[7]||(n[7]=()=>{})},null,8,["modelValue","max"])]),d("div",le,[n[15]||(n[15]=d("div",{class:"p-3 txt-semilight"},"-1",-1)),d("div",oe,M(l(o).max_tokens),1)])])]))}});export{he as _};
