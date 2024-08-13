import{d as r,o as d,c as h,a as t,e as o,u as e,H as n,M as a,s as l,k as c,i as s,t as g,v as u}from"./index-oQ1hFXLf.js";import{_ as m}from"./AgentWidget.vue_vue_type_script_setup_true_lang-DMnp1VeP.js";import"./RobotIcon-CC0bTfkr.js";const p=u('<div class="prosed"><h1>Basic Agent</h1><p>The body of Agent Smith can interact with the user. Note: we use Vuejs and Tailwindcss for the UI code examples. </p><p><span class="text-bold">Note:</span> the interactivity bindings are managed with <a href="https://github.com/nanostores/nanostores">Nanostores</a>. Install the <a href="https://github.com/nanostores/nanostores?tab=readme-ov-file#integration">integration</a> for your framework, here we will use <a href="https://github.com/nanostores/vue">@nanostores/vue</a> for the examples below. </p></div>',1),b={class:"flex flex-col space-y-5 mt-5"},v=t("p",null,[s("Let's create a basic agent in a "),t("kbd",null,"agent/agent.ts"),s(" file:")],-1),f=t("div",null,[s("The "),t("kbd",null,"state"),s(" variable will be used to manage the UI interactivity. Now give let's our agent a body in a "),t("kbd",null,"agent/AgentWidget.vue"),s(" file. In the script part:")],-1),_=t("div",null,"In the template part:",-1),w=t("div",{class:"prose"},[t("h2",null,"Interactions"),t("h3",null,"Show / hide")],-1),x={class:"mt-3"},k=t("div",{class:"pt-5"},[t("a",{href:"javascript:openLink('/the_body/interactions/talk')"},"Next: the talk interaction")],-1),j=`import { useAgentSmith } from "@agent-smith/body";
import { useStore } from '@nanostores/vue'

const agent = useAgentSmith({ name: "Agent" });
const state = useStore(agent.state);

export { agent, state }`,V=`import { agent } from "./agent";
import RobotIcon from "../widgets/RobotIcon.vue";`,y=`<template>
    <div class="fixed bottom-12 right-8 z-50">
        <template v-if="state.isVisible">
            <robot-icon class="text-5xl cursor-pointer"></robot-icon>
        </template>
    </div>
</template>`,N=`<button class="btn light" @click="state.isVisible ? agent.hide() : agent.show();">
    Toggle Joe
</button>
<div class="mt-3">
    Joe is visible: <code>{{ state.isVisible }}</code>
</div>`,C=r({__name:"basic_agent",setup(S){return(I,i)=>(d(),h("div",null,[p,t("div",b,[v,o(e(a),{hljs:e(n),code:j,lang:"ts"},null,8,["hljs"]),f,t("div",null,[o(e(a),{hljs:e(n),code:V,lang:"ts"},null,8,["hljs"])]),_,t("div",null,[o(e(a),{hljs:e(n),code:y,lang:"html"},null,8,["hljs"])]),w,t("div",null,[t("button",{class:"btn light",onClick:i[0]||(i[0]=A=>{e(l).isVisible?e(c).hide():e(c).show()})},"Toggle agent"),t("div",x,[s("Agent is visible: "),t("code",null,g(e(l).isVisible),1)])]),t("div",null,[o(e(a),{hljs:e(n),code:N,lang:"html"},null,8,["hljs"])])]),o(m),k]))}});export{C as default};
