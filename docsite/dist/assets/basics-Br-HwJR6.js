import{s as g}from"./textarea.esm-BXWWJxwH.js";import{d as S,x as b,z as i,r as h,b as T,o as _,c as f,a as e,e as n,u as t,H as l,M as a,i as s,n as q,t as y,h as x,k as C,A as L}from"./index-BhJnANCl.js";import{_ as B}from"./AgentWidget.vue_vue_type_script_setup_true_lang-CEYcoyBi.js";import{discover as M}from"./utils-CLfCPNDT.js";import"./RobotIcon-BYbFOHW3.js";const O=e("div",{class:"prosed"},[e("h1",null,"The brain: basics")],-1),V={class:"flex flex-col space-y-5 mt-5"},N=e("div",null,"The brain module manages connections to inference servers. It is usable independently of the body. In this example we are going to use a local Koboldcpp server. ",-1),A=e("div",null,[s("Start a local Koboldcpp server with "),e("a",{href:"https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF"},"Tinyllama Chat"),s(" (1B) to run the interactive examples on this page. We are using a small model so that this example can run with a small memory and on CPU only. ")],-1),I=e("div",null,"First let's declare our brain module with one expert:",-1),Q=e("div",null,[s("Note the "),e("kbd",null,"template"),s(" parameter. If you use another model change it accordingly. The templates are managed with the "),e("a",{href:"https://github.com/synw/modprompt"},"Modprompt"),s(" library that covers the most common formats. ")],-1),W=e("div",null,"Let's ping our server to check if it's up:",-1),H=e("div",null,"The template part:",-1),J=e("div",null,"Now let's use the brain module and make a simple query:",-1),E=e("br",null,null,-1),P=["disabled"],R=["innerHTML"],U=e("div",null,[s("Here the "),e("kbd",null,"q1"),s(" variable is just a text ref. ")],-1),$=e("div",{class:"prosed"},[e("h2",null,"Inference parameters")],-1),z=e("div",null,[s(" The prompt above uses default server inference parameters. It is possible to configure the inference parameters for each prompt. Agent Smith uses the "),e("a",{href:"https://github.com/synw/locallm"},"LocalLm"),s(" library. See all the available inference params in the "),e("a",{href:"https://synw.github.io/locallm/types/interfaces/InferenceParams.html"},"api doc"),s(". Example with a few params: ")],-1),K=["disabled"],F={key:1},G={class:"font-light"},D=e("div",{class:"prosed"},[e("h2",null,"Observability")],-1),X=e("div",null,"The template used and the exact final prompt sent to the language model can be inspected. The template in json:",-1),Y=e("div",null,[s("We use the brain current expert "),e("kbd",null,"ex"),s("'s template object. Code:")],-1),Z=e("div",null,"The template in plain text:",-1),ee=e("div",null,"Code:",-1),te=e("div",null,"The final prompt",-1),se=e("div",null,"Code:",-1),ne=e("div",null,[s("Check the "),e("a",{href:"https://github.com/synw/modprompt"},"Modprompt"),s(" library for more details.")],-1),le=e("div",{class:"pt-5"},[e("a",{href:"javascript:openLink('/the_brain/options')"},"Next: options")],-1),ae=`import { useStore } from '@nanostores/vue';
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
const brainState = useStore(brain.state);`,oe=`<div>
    <button class="btn light" @click="brain.discover()">Ping server</button>
</div>
<div>Server is up:
    <code :class="brainState.isOn ? 'txt-success' : 'txt-warning'">
        {{ brainState.isOn }}
    </code>
</div>`,ie=`<div>
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
<div v-html="brainStream.replaceAll('\\n', '<br />')"></div>`,re='const q1 = ref("Write a short list of the planets names of the solar system");',de=`async function runQuery() {
    await brain.think(q2.value, {
        temperature: 0,
        min_p: 0.05,
        max_tokens: 200,
    })
}`,ue="brain.ex.template.toJson()",ce="brain.ex.template.render()",he='brain.ex.template.prompt("Write a short list of...")',ye=S({__name:"basics",setup(me){let m=b(i.stream),d=b(i.state);const p=h(!1),u=h("q1"),v=h("Write a short list of the planets names of the solar system"),c=h("Write a short list of the planets names of the solar system. Important: return only the list in a markdown block");async function j(){u.value="q2",await i.think(c.value,{temperature:0,min_p:.05,max_tokens:200},{verbose:!0})}async function k(){u.value="q1",await i.think(v.value,{temperature:0,min_p:.05,max_tokens:200},{verbose:!0})}async function w(){C.state.setKey("component","AgentBaseText"),i.state.get().isOn||await L(),m=b(i.ex.stream),p.value=!0}return T(()=>{w()}),(pe,o)=>(_(),f("div",null,[O,e("div",V,[N,A,I,e("div",null,[n(t(a),{hljs:t(l),code:ae,lang:"ts"},null,8,["hljs"])]),Q,W,e("div",null,[e("button",{class:"btn light",onClick:o[0]||(o[0]=r=>t(M)())},"Ping server")]),e("div",null,[s("Server is up: "),e("code",{class:q(t(d).isOn?"txt-success":"txt-warning")},y(t(d).isOn),3)]),H,e("div",null,[n(t(a),{hljs:t(l),code:oe,lang:"html"},null,8,["hljs"])]),J,e("div",null,[s(" Query:"),E,n(t(g),{class:"w-[50rem] mt-3",modelValue:v.value,"onUpdate:modelValue":o[1]||(o[1]=r=>v.value=r),rows:1},null,8,["modelValue"])]),e("div",null,[e("button",{class:"btn semilight",onClick:o[2]||(o[2]=r=>k()),disabled:!t(d).isOn},"Run the query",8,P)]),u.value=="q1"&&p.value?(_(),f("div",{key:0,innerHTML:t(m).replaceAll(`
`,"<br />"),class:"font-light"},null,8,R)):x("",!0),e("div",null,[n(t(a),{hljs:t(l),code:ie,lang:"html"},null,8,["hljs"])]),U,e("div",null,[n(t(a),{hljs:t(l),code:re,lang:"ts"},null,8,["hljs"])]),$,z,e("div",null,[n(t(g),{class:"w-[50rem] mt-3",modelValue:c.value,"onUpdate:modelValue":o[3]||(o[3]=r=>c.value=r),rows:2},null,8,["modelValue"])]),e("div",null,[e("button",{class:"btn semilight",onClick:o[4]||(o[4]=r=>j()),disabled:!t(d).isOn},"Run the query",8,K)]),u.value=="q2"&&p.value?(_(),f("div",F,[e("pre",G,y(t(m)),1)])):x("",!0),e("div",null,[n(t(a),{hljs:t(l),code:de,lang:"ts"},null,8,["hljs"])]),D,X,e("div",null,[n(t(a),{hljs:t(l),code:JSON.stringify(t(i).ex.template.toJson()),lang:"ts"},null,8,["hljs","code"])]),Y,e("div",null,[n(t(a),{hljs:t(l),code:ue,lang:"ts"},null,8,["hljs"])]),Z,e("div",null,[n(t(a),{hljs:t(l),code:t(i).ex.template.render(),lang:"html"},null,8,["hljs","code"])]),ee,e("div",null,[n(t(a),{hljs:t(l),code:ce,lang:"ts"},null,8,["hljs"])]),te,e("div",null,[n(t(a),{hljs:t(l),code:t(i).ex.template.prompt(c.value),lang:"html"},null,8,["hljs","code"])]),se,e("div",null,[n(t(a),{hljs:t(l),code:he,lang:"ts"},null,8,["hljs"])]),n(B),ne,le])]))}});export{ye as default};
