import{s as b}from"./textarea.esm-BwKV3_-E.js";import{d as x,r as m,b as j,o as p,c as v,a as e,e as l,u as t,H as n,M as o,g as s,n as k,t as _,f}from"./index-oVJ3EP-5.js";import{a as w,d as u,c as r,b as g}from"./agent-D-MHC7ZO.js";import{_ as S}from"./AgentJoeV3.vue_vue_type_style_index_0_lang-CqTNgXYz.js";import{discover as T}from"./utils-DlMVOWdX.js";import"./lm-CYyAsx-B.js";import"./index-CEjRDeBB.js";import"./RobotIcon-BQIaq6TA.js";import"./_plugin-vue_export-helper-DlAUqK2U.js";const q=e("div",{class:"prosed"},[e("h1",null,"The brain: basics")],-1),C={class:"flex flex-col space-y-5 mt-5"},B=e("div",null,"The brain module manages connections to inference servers. It is usable independently of the body. In this example we are going to use a local Koboldcpp server. ",-1),L=e("div",null,[s("Start a local Koboldcpp server with "),e("a",{href:"https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF"},"Tinyllama Chat"),s(" (1B) to run the interactive examples on this page. We are using a small model so that this example can run with a small memory and on CPU only. ")],-1),M=e("div",null,"First let's declare our brain module with one expert:",-1),V=e("div",null,[s("Note the "),e("kbd",null,"template"),s(" parameter. If you use another model change it accordingly. The templates are managed with the "),e("a",{href:"https://github.com/synw/modprompt"},"Modprompt"),s(" library that covers the most common formats. ")],-1),N=e("div",null,"Let's ping our server to check if it's up:",-1),O=e("div",null,"The template part:",-1),A=e("div",null,"Now let's use the brain module and make a simple query:",-1),I=e("br",null,null,-1),W=["disabled"],H=["innerHTML"],J=e("div",null,[s("Here the "),e("kbd",null,"q1"),s(" variable is just a text ref. ")],-1),Q=e("div",{class:"prosed"},[e("h2",null,"Inference parameters")],-1),E=e("div",null,[s(" The prompt above uses default server inference parameters. It is possible to configure the inference parameters for each prompt. Agent Smith uses the "),e("a",{href:"https://github.com/synw/locallm"},"LocalLm"),s(" library. See all the available inference params in the "),e("a",{href:"https://synw.github.io/locallm/types/interfaces/InferenceParams.html"},"api doc"),s(". Example with a few params: ")],-1),P=["disabled"],U={key:1},$={class:"font-light"},K=e("div",{class:"prosed"},[e("h2",null,"Observability")],-1),R=e("div",null,"The template used and the exact final prompt sent to the language model can be inspected. The template in json:",-1),z=e("div",null,[s("We use the brain current expert "),e("kbd",null,"ex"),s("'s template object. Code:")],-1),F=e("div",null,"The template in plain text:",-1),G=e("div",null,"Code:",-1),D=e("div",null,"The final prompt",-1),X=e("div",null,"Code:",-1),Y=e("div",null,[s("Check the "),e("a",{href:"https://github.com/synw/modprompt"},"Modprompt"),s(" library for more details.")],-1),Z=e("div",{class:"pt-5"},[e("a",{href:"javascript:openLink('/the_brain/options')"},"Next: options")],-1),ee=`import { useStore } from '@nanostores/vue';
import { useLmExpert, useAgentBrain } from "@agent-smith/brain";

const expert = useLmExpert({
    name: "default",
    localLm: "koboldcpp",
    templateName: "zephyr",
});
// map the brain to the body (optional)
const joe = useAgentSmith({
    name: "Joe",
    jobs: jobs,
    modules: [brainModule],
});

const brainModule = useAgentBrain([expert]);
const brain = brainModule.brain;
// this one is to get reactive variables in the ui template
const brainState = useStore(brain.state);`,te=`<div>
    <button class="btn light" @click="brain.discover()">Ping server</button>
</div>
<div>Server is up:
    <code :class="brainState.isOn ? 'txt-success' : 'txt-warning'">
        {{ brainState.isOn }}
    </code>
</div>`,se=`<div>
    Query:<br />
    <Textarea class="w-[50rem] mt-3" v-model="q1" :rows="1" />
</div>
<div>
    <button class="btn light" 
        @click="brain.think(q1)" 
        :disabled="!brainState.isOn">
        Run the query
    </button>
</div>
<div v-html="brainStream.replaceAll('\\n', '<br />')"></div>`,le='const q1 = ref("Write a short list of the planets names of the solar system");',ne=`async function runQuery() {
    await brain.think(q2.value, {
        temperature: 0,
        min_p: 0.05,
        max_tokens: 200,
    })
}`,oe="brain.ex.template.toJson()",ae="brain.ex.template.render()",ie='brain.ex.template.prompt("Write a short list of...")',ge=x({__name:"basics",setup(re){const c=m("q1"),h=m("Write a short list of the planets names of the solar system"),d=m("Write a short list of the planets names of the solar system. Important: return only the list in a markdown block");async function y(){c.value="q2",await r.think(d.value,{temperature:0,min_p:.05,max_tokens:200})}return j(()=>w.state.setKey("component","AgentBaseText")),(de,a)=>(p(),v("div",null,[q,e("div",C,[B,L,M,e("div",null,[l(t(o),{hljs:t(n),code:ee,lang:"ts"},null,8,["hljs"])]),V,N,e("div",null,[e("button",{class:"btn light",onClick:a[0]||(a[0]=i=>t(T)())},"Ping server")]),e("div",null,[s("Server is up: "),e("code",{class:k(t(u).isOn?"txt-success":"txt-warning")},_(t(u).isOn),3)]),O,e("div",null,[l(t(o),{hljs:t(n),code:te,lang:"html"},null,8,["hljs"])]),A,e("div",null,[s(" Query:"),I,l(t(b),{class:"w-[50rem] mt-3",modelValue:h.value,"onUpdate:modelValue":a[1]||(a[1]=i=>h.value=i),rows:1},null,8,["modelValue"])]),e("div",null,[e("button",{class:"btn semilight",onClick:a[2]||(a[2]=i=>{t(r).think(h.value)}),disabled:!t(u).isOn},"Run the query",8,W)]),c.value=="q1"?(p(),v("div",{key:0,innerHTML:t(g).replaceAll(`
`,"<br />"),class:"font-light"},null,8,H)):f("",!0),e("div",null,[l(t(o),{hljs:t(n),code:se,lang:"html"},null,8,["hljs"])]),J,e("div",null,[l(t(o),{hljs:t(n),code:le,lang:"ts"},null,8,["hljs"])]),Q,E,e("div",null,[l(t(b),{class:"w-[50rem] mt-3",modelValue:d.value,"onUpdate:modelValue":a[3]||(a[3]=i=>d.value=i),rows:2},null,8,["modelValue"])]),e("div",null,[e("button",{class:"btn semilight",onClick:a[4]||(a[4]=i=>y()),disabled:!t(u).isOn},"Run the query",8,P)]),c.value=="q2"?(p(),v("div",U,[e("pre",$,_(t(g)),1)])):f("",!0),e("div",null,[l(t(o),{hljs:t(n),code:ne,lang:"ts"},null,8,["hljs"])]),K,R,e("div",null,[l(t(o),{hljs:t(n),code:JSON.stringify(t(r).ex.template.toJson()),lang:"ts"},null,8,["hljs","code"])]),z,e("div",null,[l(t(o),{hljs:t(n),code:oe,lang:"ts"},null,8,["hljs"])]),F,e("div",null,[l(t(o),{hljs:t(n),code:t(r).ex.template.render(),lang:"html"},null,8,["hljs","code"])]),G,e("div",null,[l(t(o),{hljs:t(n),code:ae,lang:"ts"},null,8,["hljs"])]),D,e("div",null,[l(t(o),{hljs:t(n),code:t(r).ex.template.prompt(d.value),lang:"html"},null,8,["hljs","code"])]),X,e("div",null,[l(t(o),{hljs:t(n),code:ie,lang:"ts"},null,8,["hljs"])]),l(S),Y,Z])]))}});export{ge as default};
