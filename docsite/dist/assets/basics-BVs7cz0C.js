import{s as b}from"./textarea.esm-D2yOeTtn.js";import{d as x,r as m,o as p,c as v,a as e,e as l,u as t,H as n,M as o,g as s,n as j,t as _,f}from"./index-CboZIT6v.js";import{c as r,d as u,b as g}from"./agent-BFtiMqbc.js";import"./lm-BizhkHiD.js";import"./index-BZxdWYOY.js";const k=e("div",{class:"prosed"},[e("h1",null,"The brain: basics")],-1),w={class:"flex flex-col space-y-5 mt-5"},S=e("div",null,"The brain module manages connections to inference servers. It is usable independently of the body. In this example we are going to use a local Koboldcpp server. Start a local server with Mistral Instruct 7B to run the interactive examples on this page. ",-1),q=e("div",null,"First let's declare our brain module with one expert:",-1),T=e("div",null,[s("Note the "),e("kbd",null,"template"),s(" parameter. If you use another model change it accordingly. The templates are managed with the "),e("a",{href:"https://github.com/synw/modprompt"},"Modprompt"),s(" library that covers the most common formats. ")],-1),C=e("div",null,"Let's ping our server to check if it's up:",-1),M=e("div",null,"The template part:",-1),V=e("div",null,"Now let's use the brain module and make a simple query:",-1),L=e("br",null,null,-1),N=["disabled"],O=["innerHTML"],I=e("div",null,[s("Here the "),e("kbd",null,"q1"),s(" variable is just a text ref. ")],-1),A=e("div",{class:"prosed"},[e("h2",null,"Inference parameters")],-1),B=e("div",null,[s(" The prompt above uses default server inference parameters. It is possible to configure the inference parameters for each prompt. Agent Smith uses the "),e("a",{href:"https://github.com/synw/locallm"},"LocalLm"),s(" library. See all the available inference params in the "),e("a",{href:"https://synw.github.io/locallm/types/interfaces/InferenceParams.html"},"api doc"),s(". Example with a few params: ")],-1),H=["disabled"],J={key:1},Q={class:"font-light"},W=e("div",{class:"prosed"},[e("h2",null,"Observability")],-1),E=e("div",null,"The template used and the exact final prompt sent to the language model can be inspected. The template in json:",-1),P=e("div",null,[s("We use the brain current expert "),e("kbd",null,"ex"),s("'s template object. Code:")],-1),R=e("div",null,"The template in plain text:",-1),$=e("div",null,"Code:",-1),U=e("div",null,"The final prompt",-1),z=e("div",null,"Code:",-1),D=e("div",null,[s("Check the "),e("a",{href:"https://github.com/synw/modprompt"},"Modprompt"),s(" library for more details.")],-1),F=e("div",{class:"pt-5"},[e("a",{href:"javascript:openLink('/the_brain/options')"},"Next: options")],-1),K=`import { useStore } from '@nanostores/vue';
import { useLmExpert, useAgentBrain } from "@agent-smith/brain";

const expert = useLmExpert({
    name: "default",
    localLm: "koboldcpp",
    templateName: "mistral",
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
const brainState = useStore(brain.state);`,G=`<div>
    <button class="btn light" @click="brain.discover()">Ping server</button>
</div>
<div>Server is up:
    <code :class="brainState.isOn ? 'txt-success' : 'txt-warning'">
        {{ brainState.isOn }}
    </code>
</div>`,X=`<div>
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
<div v-html="brainStream.replaceAll('\\n', '<br />')"></div>`,Y='const q1 = ref("Write a short list of the planets names of the solar system");',Z=`async function runQuery() {
    await brain.think(q2.value, {
        temperature: 0,
        min_p: 0.05,
        max_tokens: 500,
    })
}`,ee="brain.ex.template.toJson()",te="brain.ex.template.render()",se='brain.ex.template.prompt("Write a short list of...")',ue=x({__name:"basics",setup(le){const c=m("q1"),h=m("Write a short list of the planets names of the solar system"),d=m("Write a short list of the planets names of the solar system. Important: return only the list in a markdown block");async function y(){c.value="q2",await r.think(d.value,{temperature:0,min_p:.05,max_tokens:500})}return(ne,a)=>(p(),v("div",null,[k,e("div",w,[S,q,e("div",null,[l(t(o),{hljs:t(n),code:K,lang:"ts"},null,8,["hljs"])]),T,C,e("div",null,[e("button",{class:"btn light",onClick:a[0]||(a[0]=i=>t(r).discover())},"Ping server")]),e("div",null,[s("Server is up: "),e("code",{class:j(t(u).isOn?"txt-success":"txt-warning")},_(t(u).isOn),3)]),M,e("div",null,[l(t(o),{hljs:t(n),code:G,lang:"html"},null,8,["hljs"])]),V,e("div",null,[s(" Query:"),L,l(t(b),{class:"w-[50rem] mt-3",modelValue:h.value,"onUpdate:modelValue":a[1]||(a[1]=i=>h.value=i),rows:1},null,8,["modelValue"])]),e("div",null,[e("button",{class:"btn semilight",onClick:a[2]||(a[2]=i=>{t(r).think(h.value)}),disabled:!t(u).isOn},"Run the query",8,N)]),c.value=="q1"?(p(),v("div",{key:0,innerHTML:t(g).replaceAll(`
`,"<br />"),class:"font-light"},null,8,O)):f("",!0),e("div",null,[l(t(o),{hljs:t(n),code:X,lang:"html"},null,8,["hljs"])]),I,e("div",null,[l(t(o),{hljs:t(n),code:Y,lang:"ts"},null,8,["hljs"])]),A,B,e("div",null,[l(t(b),{class:"w-[50rem] mt-3",modelValue:d.value,"onUpdate:modelValue":a[3]||(a[3]=i=>d.value=i),rows:2},null,8,["modelValue"])]),e("div",null,[e("button",{class:"btn semilight",onClick:a[4]||(a[4]=i=>y()),disabled:!t(u).isOn},"Run the query",8,H)]),c.value=="q2"?(p(),v("div",J,[e("pre",Q,_(t(g)),1)])):f("",!0),e("div",null,[l(t(o),{hljs:t(n),code:Z,lang:"ts"},null,8,["hljs"])]),W,E,e("div",null,[l(t(o),{hljs:t(n),code:JSON.stringify(t(r).ex.template.toJson()),lang:"ts"},null,8,["hljs","code"])]),P,e("div",null,[l(t(o),{hljs:t(n),code:ee,lang:"ts"},null,8,["hljs"])]),R,e("div",null,[l(t(o),{hljs:t(n),code:t(r).ex.template.render(),lang:"html"},null,8,["hljs","code"])]),$,e("div",null,[l(t(o),{hljs:t(n),code:te,lang:"ts"},null,8,["hljs"])]),U,e("div",null,[l(t(o),{hljs:t(n),code:t(r).ex.template.prompt(d.value),lang:"html"},null,8,["hljs","code"])]),z,e("div",null,[l(t(o),{hljs:t(n),code:se,lang:"ts"},null,8,["hljs"])]),D,F])]))}});export{ue as default};
