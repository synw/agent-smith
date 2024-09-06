import{d,o as g,c as u,q as m,a as t,h as o,e as n,u as s,H as a,M as i,s as l,k as r,t as h}from"./index-BMtjbDYc.js";import{_ as p}from"./AgentWidget.vue_vue_type_script_setup_true_lang-RfLzUZpa.js";import"./RobotIcon-BjdlsRE6.js";const c={class:"flex flex-col space-y-5 mt-5"},b={class:"mt-3"},v=`import { useAgentSmith } from "@agent-smith/body";
import { useStore } from '@nanostores/vue'

const agent = useAgentSmith({ name: "Agent" });
const state = useStore(agent.state);

export { agent, state }`,f=`import { agent } from "./agent";
import RobotIcon from "../widgets/RobotIcon.vue";`,w=`<template>
    <div class="fixed bottom-12 right-8 z-50">
        <template v-if="state.isVisible">
            <robot-icon class="text-5xl cursor-pointer"></robot-icon>
        </template>
    </div>
</template>`,x=`<button class="btn light" @click="state.isVisible ? agent.hide() : agent.show();">
    Toggle Joe
</button>
<div class="mt-3">
    Joe is visible: <code>{{ state.isVisible }}</code>
</div>`,I=d({__name:"basic_agent",setup(k){return(j,e)=>(g(),u("div",null,[e[6]||(e[6]=m('<div class="prosed"><h1>Basic Agent</h1><p>The body of Agent Smith can interact with the user. Note: we use Vuejs and Tailwindcss for the UI code examples. </p><p><span class="text-bold">Note:</span> the interactivity bindings are managed with <a href="https://github.com/nanostores/nanostores">Nanostores</a>. Install the <a href="https://github.com/nanostores/nanostores?tab=readme-ov-file#integration">integration</a> for your framework, here we will use <a href="https://github.com/nanostores/vue">@nanostores/vue</a> for the examples below. </p></div>',1)),t("div",c,[e[2]||(e[2]=t("p",null,[o("Let's create a basic agent in a "),t("kbd",null,"agent/agent.ts"),o(" file:")],-1)),n(s(i),{hljs:s(a),code:v,lang:"ts"},null,8,["hljs"]),e[3]||(e[3]=t("div",null,[o("The "),t("kbd",null,"state"),o(" variable will be used to manage the UI interactivity. Now give let's our agent a body in a "),t("kbd",null,"agent/AgentWidget.vue"),o(" file. In the script part:")],-1)),t("div",null,[n(s(i),{hljs:s(a),code:f,lang:"ts"},null,8,["hljs"])]),e[4]||(e[4]=t("div",null,"In the template part:",-1)),t("div",null,[n(s(i),{hljs:s(a),code:w,lang:"html"},null,8,["hljs"])]),e[5]||(e[5]=t("div",{class:"prose"},[t("h2",null,"Interactions"),t("h3",null,"Show / hide")],-1)),t("div",null,[t("button",{class:"btn light",onClick:e[0]||(e[0]=V=>{s(l).isVisible?s(r).hide():s(r).show()})},"Toggle agent"),t("div",b,[e[1]||(e[1]=o("Agent is visible: ")),t("code",null,h(s(l).isVisible),1)])]),t("div",null,[n(s(i),{hljs:s(a),code:x,lang:"html"},null,8,["hljs"])])]),n(p),e[7]||(e[7]=t("div",{class:"pt-5"},[t("a",{href:"javascript:openLink('/the_body/interactions/talk')"},"Next: the talk interaction")],-1))]))}});export{I as default};
