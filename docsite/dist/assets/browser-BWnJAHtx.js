import{d as y,r as a,u as M,b as I,o as c,c as p,a as l,h as d,g as u,f as o,H as f,M as b,z as j,i as h,t as x,n as B,P as T}from"./index-B7hGVm-Y.js";import{s as V}from"./textarea.esm-BTcFcjyn.js";const C={class:"flex flex-col space-y-5 mt-5"},F=["disabled"],q={key:0},H={class:"flex flex-row space-x-3"},N=["disabled"],S=`import { useLmExpert, useLmBackend } from "@agent-smith/brain";

const ex = useLmExpert({
    name: "demo",
    backend: useLmBackend({ name: "browser", localLm: "browser" }),
    template: "chatml",
    model: {
        name: "smollm-360m",
        ctx: 2048,
        extra: {
            urls: "https://huggingface.co/HuggingFaceTB/smollm-360M-instruct-v0.2-Q8_0-GGUF/resolve/main/smollm-360m-instruct-add-basics-q8_0.gguf"
        }
    },
});`,E=`const onModelLoading = (st) => {
    console.log(st.percent, "%")
}

async function loadModel() {
    await ex.loadModel(onModelLoading);
}`,z=y({__name:"browser",setup(G){const g=a(""),v=a(0),t=a(!1),r=a(!1),m=a("List the orbital periods of the planets of the solar system"),n=M({name:"demo",backend:I({name:"browser",localLm:"browser"}),template:"chatml",model:{name:"smollm-360m",ctx:2048,extra:{urls:"https://huggingface.co/HuggingFaceTB/smollm-360M-instruct-v0.2-Q8_0-GGUF/resolve/main/smollm-360m-instruct-add-basics-q8_0.gguf"}}}),w=s=>{console.log(s.percent,"%"),v.value=s.percent};async function L(){await n.loadModel(w),console.log("Status",n.state.get().status),n.backend.setOnToken(s=>g.value+=s),t.value=!0}async function k(){r.value=!0;const s=new T("chatml").replaceSystem("You are an AI assistant. Important: always use json to respond").prompt(m.value),e=await n.think(s,{temperature:0,min_p:.05,max_tokens:512});r.value=!1,console.log(e.stats)}return(s,e)=>(c(),p("div",null,[e[11]||(e[11]=l("div",{class:"prosed"},[l("h1",null,"In browser inference")],-1)),l("div",C,[e[4]||(e[4]=l("div",null,[d("Run inference queries locally in the browser. It uses "),l("a",{href:"https://github.com/ngxson/wllama"},"Wllama"),d(" to run Llama.cpp in the browser. It supports only cpu inference for now.")],-1)),e[5]||(e[5]=l("div",{class:"prosed"},[l("h2",null,"Initialize")],-1)),l("div",null,[u(o(b),{hljs:o(f),code:S,lang:"ts"},null,8,["hljs"])]),e[6]||(e[6]=l("div",{class:"prosed"},[l("h2",null,"Load a model")],-1)),e[7]||(e[7]=l("div",null,"Let's load the Smollm 360m instruct model from HuggingFace:",-1)),l("div",null,[u(o(b),{hljs:o(f),code:E,lang:"ts"},null,8,["hljs"])]),e[8]||(e[8]=l("div",null,[d("The model will be downloaded once and placed in the cache for later local load. Important: the model files must not exceed 512 megabytes to be able to stay in the cache. For models bigger than 512M split the gguf files using Llama.cpp (ref: "),l("a",{href:"https://github.com/ngxson/wllama?tab=readme-ov-file#split-model"},"Wllama doc"),d(") ")],-1)),l("div",null,[l("button",{class:"btn light",onClick:e[0]||(e[0]=i=>L()),disabled:t.value},"Load model",8,F)]),t.value?h("",!0):(c(),p("div",q,[u(o(j),{value:v.value},null,8,["value"])])),l("div",null,"Is model loaded: "+x(t.value),1),e[9]||(e[9]=l("div",{class:"prosed"},[l("h2",null,"Run an inference query")],-1)),l("div",null,[u(o(V),{class:"w-[50rem] mt-3",modelValue:m.value,"onUpdate:modelValue":e[1]||(e[1]=i=>m.value=i),rows:1},null,8,["modelValue"])]),l("div",H,[l("button",{class:B(["btn",t.value?"success":"light"]),onClick:e[2]||(e[2]=i=>k()),disabled:!t.value||r.value},"Run inference",10,N),r.value?(c(),p("button",{key:0,class:"btn danger",onClick:e[3]||(e[3]=i=>o(n).abortThinking())},"Abort")):h("",!0)]),l("div",null,x(g.value),1),e[10]||(e[10]=l("div",{class:"pt-5"},[l("a",{href:"javascript:openLink('/the_brain/jobs')"},"Next: jobs")],-1))])]))}});export{z as default};
