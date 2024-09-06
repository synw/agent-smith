import{s as y}from"./textarea.esm-CyVB3fZ-.js";import{d as T,x as f,z as i,r as p,b as q,o as g,c,a as t,h as n,e as s,u as l,H as o,M as a,n as C,t as x,i as j,k as L,A as B}from"./index-BMtjbDYc.js";import{_ as M}from"./AgentWidget.vue_vue_type_script_setup_true_lang-RfLzUZpa.js";import{discover as O}from"./utils-DVdBhLDK.js";import"./RobotIcon-BjdlsRE6.js";const V={class:"flex flex-col space-y-5 mt-5"},N=["disabled"],A=["innerHTML"],I=["disabled"],Q={key:1},W={class:"font-light"},H=`import { useStore } from '@nanostores/vue';
import { useLmExpert, useAgentBrain } from "@agent-smith/brain";

const expert = useLmExpert({
    name: "default",
    localLm: "koboldcpp",
    templateName: "zephyr",
});
// map the brain to the body (optional)
const agent = useAgentSmith({
    name: "Joe",
    jobs: jobs,
    modules: [brainModule],
});

const brainModule = useAgentBrain([expert]);
const brain = brainModule.brain;
// this one is to get reactive variables in the ui template
const brainState = useStore(brain.state);`,J=`<div>
    <button class="btn light" @click="brain.discover()">Ping server</button>
</div>
<div>Server is up:
    <code :class="brainState.isOn ? 'txt-success' : 'txt-warning'">
        {{ brainState.isOn }}
    </code>
</div>`,E=`<div>
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
<div v-html="brainStream.replaceAll('\\n', '<br />')"></div>`,P='const q1 = ref("Write a short list of the planets names of the solar system");',R=`async function runQuery() {
    await brain.think(q2.value, {
        temperature: 0,
        min_p: 0.05,
        max_tokens: 200,
    })
}`,U="brain.ex.template.toJson()",$="brain.ex.template.render()",z='brain.ex.template.prompt("Write a short list of...")',_=T({__name:"basics",setup(K){let v=f(i.stream),u=f(i.state);const b=p(!1),d=p("q1"),h=p("Write a short list of the planets names of the solar system"),m=p("Write a short list of the planets names of the solar system. Important: return only the list in a markdown block");async function k(){d.value="q2",await i.think(m.value,{temperature:0,min_p:.05,max_tokens:200},{verbose:!0})}async function w(){d.value="q1",await i.think(h.value,{temperature:0,min_p:.05,max_tokens:200},{verbose:!0})}async function S(){L.state.setKey("component","AgentBaseText"),i.state.get().isOn||await B(),v=f(i.ex.stream),b.value=!0}return q(()=>{S()}),(F,e)=>(g(),c("div",null,[e[27]||(e[27]=t("div",{class:"prosed"},[t("h1",null,"The brain: basics")],-1)),t("div",V,[e[8]||(e[8]=t("div",null,"The brain module manages connections to inference servers. It is usable independently of the body. In this example we are going to use a local Koboldcpp server. ",-1)),e[9]||(e[9]=t("div",null,[n("Start a local Koboldcpp server with "),t("a",{href:"https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF"},"Tinyllama Chat"),n(" (1B) to run the interactive examples on this page. We are using a small model so that this example can run with a small memory and on CPU only. ")],-1)),e[10]||(e[10]=t("div",null,"First let's declare our brain module with one expert:",-1)),t("div",null,[s(l(a),{hljs:l(o),code:H,lang:"ts"},null,8,["hljs"])]),e[11]||(e[11]=t("div",null,[n("Note the "),t("kbd",null,"template"),n(" parameter. If you use another model change it accordingly. The templates are managed with the "),t("a",{href:"https://github.com/synw/modprompt"},"Modprompt"),n(" library that covers the most common formats. ")],-1)),e[12]||(e[12]=t("div",null,"Let's ping our server to check if it's up:",-1)),t("div",null,[t("button",{class:"btn light",onClick:e[0]||(e[0]=r=>l(O)())},"Ping server")]),t("div",null,[e[5]||(e[5]=n("Server is up: ")),t("code",{class:C(l(u).isOn?"txt-success":"txt-warning")},x(l(u).isOn),3)]),e[13]||(e[13]=t("div",null,"The template part:",-1)),t("div",null,[s(l(a),{hljs:l(o),code:J,lang:"html"},null,8,["hljs"])]),e[14]||(e[14]=t("div",null,"Now let's use the brain module and make a simple query:",-1)),t("div",null,[e[6]||(e[6]=n(" Query:")),e[7]||(e[7]=t("br",null,null,-1)),s(l(y),{class:"w-[50rem] mt-3",modelValue:h.value,"onUpdate:modelValue":e[1]||(e[1]=r=>h.value=r),rows:1},null,8,["modelValue"])]),t("div",null,[t("button",{class:"btn semilight",onClick:e[2]||(e[2]=r=>w()),disabled:!l(u).isOn},"Run the query",8,N)]),d.value=="q1"&&b.value?(g(),c("div",{key:0,innerHTML:l(v).replaceAll(`
`,"<br />"),class:"font-light"},null,8,A)):j("",!0),t("div",null,[s(l(a),{hljs:l(o),code:E,lang:"html"},null,8,["hljs"])]),e[15]||(e[15]=t("div",null,[n("Here the "),t("kbd",null,"q1"),n(" variable is just a text ref. ")],-1)),t("div",null,[s(l(a),{hljs:l(o),code:P,lang:"ts"},null,8,["hljs"])]),e[16]||(e[16]=t("div",{class:"prosed"},[t("h2",null,"Inference parameters")],-1)),e[17]||(e[17]=t("div",null,[n(" The prompt above uses default server inference parameters. It is possible to configure the inference parameters for each prompt. Agent Smith uses the "),t("a",{href:"https://github.com/synw/locallm"},"LocalLm"),n(" library. See all the available inference params in the "),t("a",{href:"https://synw.github.io/locallm/types/interfaces/InferenceParams.html"},"api doc"),n(". Example with a few params: ")],-1)),t("div",null,[s(l(y),{class:"w-[50rem] mt-3",modelValue:m.value,"onUpdate:modelValue":e[3]||(e[3]=r=>m.value=r),rows:2},null,8,["modelValue"])]),t("div",null,[t("button",{class:"btn semilight",onClick:e[4]||(e[4]=r=>k()),disabled:!l(u).isOn},"Run the query",8,I)]),d.value=="q2"&&b.value?(g(),c("div",Q,[t("pre",W,x(l(v)),1)])):j("",!0),t("div",null,[s(l(a),{hljs:l(o),code:R,lang:"ts"},null,8,["hljs"])]),e[18]||(e[18]=t("div",{class:"prosed"},[t("h2",null,"Observability")],-1)),e[19]||(e[19]=t("div",null,"The template used and the exact final prompt sent to the language model can be inspected. The template in json:",-1)),t("div",null,[s(l(a),{hljs:l(o),code:JSON.stringify(l(i).ex.template.toJson()),lang:"ts"},null,8,["hljs","code"])]),e[20]||(e[20]=t("div",null,[n("We use the brain current expert "),t("kbd",null,"ex"),n("'s template object. Code:")],-1)),t("div",null,[s(l(a),{hljs:l(o),code:U,lang:"ts"},null,8,["hljs"])]),e[21]||(e[21]=t("div",null,"The template in plain text:",-1)),t("div",null,[s(l(a),{hljs:l(o),code:l(i).ex.template.render(),lang:"html"},null,8,["hljs","code"])]),e[22]||(e[22]=t("div",null,"Code:",-1)),t("div",null,[s(l(a),{hljs:l(o),code:$,lang:"ts"},null,8,["hljs"])]),e[23]||(e[23]=t("div",null,"The final prompt",-1)),t("div",null,[s(l(a),{hljs:l(o),code:l(i).ex.template.prompt(m.value),lang:"html"},null,8,["hljs","code"])]),e[24]||(e[24]=t("div",null,"Code:",-1)),t("div",null,[s(l(a),{hljs:l(o),code:z,lang:"ts"},null,8,["hljs"])]),s(M),e[25]||(e[25]=t("div",null,[n("Check the "),t("a",{href:"https://github.com/synw/modprompt"},"Modprompt"),n(" library for more details.")],-1)),e[26]||(e[26]=t("div",{class:"pt-5"},[t("a",{href:"javascript:openLink('/the_brain/options')"},"Next: options")],-1))])]))}});export{_ as default};
