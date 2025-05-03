import{d as c,c as g,o as l,m as h,h as p,f as s,s as r,v as b,a as t,g as n,i as o,H as i,M as a,k as d,t as v}from"./index-_xxmxxzb.js";import{R as f}from"./RobotIcon-D3Pi08bE.js";const x={class:"fixed bottom-12 right-8 z-50"},k=c({__name:"AgentWidget",setup(u){return(m,e)=>(l(),g("div",x,[s(r).isVisible?(l(),h(f,{key:0,class:"text-5xl cursor-pointer"})):p("",!0)]))}}),w={class:"flex flex-col space-y-5 mt-5"},V={class:"mt-3"},j=`import { useAgentSmith } from "@agent-smith/body";
import { useStore } from '@nanostores/vue'

const agent = useAgentSmith({ name: "Agent" });
const state = useStore(agent.state);

export { agent, state }`,y=`import { agent } from "./agent";
import RobotIcon from "../widgets/RobotIcon.vue";`,N=`<template>
    <div class="fixed bottom-12 right-8 z-50">
        <template v-if="state.isVisible">
            <robot-icon class="text-5xl cursor-pointer"></robot-icon>
        </template>
    </div>
</template>`,I=`<button class="btn light" @click="state.isVisible ? agent.hide() : agent.show();">
    Toggle Joe
</button>
<div class="mt-3">
    Joe is visible: <code>{{ state.isVisible }}</code>
</div>`,T=c({__name:"basic_agent",setup(u){return(m,e)=>(l(),g("div",null,[e[6]||(e[6]=b('<div class="prosed"><h1>Basic Agent</h1><p>The body of Agent Smith can interact with the user. Note: we use Vuejs and Tailwindcss for the UI code examples. </p><p><span class="text-bold">Note:</span> the interactivity bindings are managed with <a href="https://github.com/nanostores/nanostores">Nanostores</a>. Install the <a href="https://github.com/nanostores/nanostores?tab=readme-ov-file#integration">integration</a> for your framework, here we will use <a href="https://github.com/nanostores/vue">@nanostores/vue</a> for the examples below. </p></div>',1)),t("div",w,[e[2]||(e[2]=t("p",null,[o("Let's create a basic agent in a "),t("kbd",null,"agent/agent.ts"),o(" file:")],-1)),n(s(a),{hljs:s(i),code:j,lang:"ts"},null,8,["hljs"]),e[3]||(e[3]=t("div",null,[o("The "),t("kbd",null,"state"),o(" variable will be used to manage the UI interactivity. Now give let's our agent a body in a "),t("kbd",null,"agent/AgentWidget.vue"),o(" file. In the script part:")],-1)),t("div",null,[n(s(a),{hljs:s(i),code:y,lang:"ts"},null,8,["hljs"])]),e[4]||(e[4]=t("div",null,"In the template part:",-1)),t("div",null,[n(s(a),{hljs:s(i),code:N,lang:"html"},null,8,["hljs"])]),e[5]||(e[5]=t("div",{class:"prose"},[t("h2",null,"Interactions"),t("h3",null,"Show / hide")],-1)),t("div",null,[t("button",{class:"btn light",onClick:e[0]||(e[0]=S=>{s(r).isVisible?s(d).hide():s(d).show()})},"Toggle agent"),t("div",V,[e[1]||(e[1]=o("Agent is visible: ")),t("code",null,v(s(r).isVisible),1)])]),t("div",null,[n(s(a),{hljs:s(i),code:I,lang:"html"},null,8,["hljs"])])]),n(k),e[7]||(e[7]=t("div",{class:"pt-5"},[t("a",{href:"javascript:openLink('/the_body/interactions/talk')"},"Next: the talk interaction")],-1))]))}});export{T as default};
