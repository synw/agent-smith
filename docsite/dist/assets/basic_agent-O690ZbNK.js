import{d,o as l,c as h,u as t,l as p,f as g,a as e,e as s,H as a,M as i,g as o,t as b,v}from"./index-oVJ3EP-5.js";import{j as r,a as c}from"./agent-D-MHC7ZO.js";import{R as _}from"./RobotIcon-BQIaq6TA.js";import"./lm-CYyAsx-B.js";import"./index-CEjRDeBB.js";import"./_plugin-vue_export-helper-DlAUqK2U.js";const f={class:"fixed bottom-12 right-8 z-50"},j=d({__name:"AgentJoe",setup(m){return(u,n)=>(l(),h("div",f,[t(r).isVisible?(l(),p(_,{key:0,class:"text-5xl cursor-pointer"})):g("",!0)]))}}),x=v('<div class="prosed"><h1>Basic Agent</h1><p>The body of Agent Smith can interact with the user. Note: we use Vuejs and Tailwindcss for the UI code examples. </p><p><span class="text-bold">Note:</span> the interactivity bindings are managed with <a href="https://github.com/nanostores/nanostores">Nanostores</a>. Install the <a href="https://github.com/nanostores/nanostores?tab=readme-ov-file#integration">integration</a> for your framework, here we will use <a href="https://github.com/nanostores/vue">@nanostores/vue</a> for the examples below. </p></div>',1),S={class:"flex flex-col space-y-5 mt-5"},w=e("p",null,[o("Let's create a basic agent named Joe in a "),e("kbd",null,"agent/agent.ts"),o(" file:")],-1),k=e("div",null,[o("The "),e("kbd",null,"joeState"),o(" variable will be used to manage the UI interactivity. Now give let's our agent a body in a "),e("kbd",null,"agent/AgentJoe.vue"),o(" file. In the script part:")],-1),V=e("div",null,"In the template part:",-1),y=e("div",{class:"prose"},[e("h2",null,"Interactions"),e("h3",null,"Show / hide")],-1),N={class:"mt-3"},I=e("div",{class:"pt-5"},[e("a",{href:"javascript:openLink('/the_body/interactions/talk')"},"Next: the talk interaction")],-1),J=`import { useAgentSmith } from "@agent-smith/body";
import { useStore } from '@nanostores/vue'

const joe = useAgentSmith({ name: "Joe" });
const joeState = useStore(joe.state);

export { joe, joeState }`,A=`import { joe } from "./agent";
import RobotIcon from "../widgets/RobotIcon.vue";`,T=`<template>
    <div class="fixed bottom-12 right-8 z-50">
        <template v-if="joeState.isVisible">
            <robot-icon class="text-5xl cursor-pointer"></robot-icon>
        </template>
    </div>
</template>`,B=`<button class="btn light" @click="joeState.isVisible ? joe.hide() : joe.show();">
    Toggle Joe
</button>
<div class="mt-3">
    Joe is visible: <code>{{ joeState.isVisible }}</code>
</div>`,U=d({__name:"basic_agent",setup(m){return(u,n)=>(l(),h("div",null,[x,e("div",S,[w,s(t(i),{hljs:t(a),code:J,lang:"ts"},null,8,["hljs"]),k,e("div",null,[s(t(i),{hljs:t(a),code:A,lang:"ts"},null,8,["hljs"])]),V,e("div",null,[s(t(i),{hljs:t(a),code:T,lang:"html"},null,8,["hljs"])]),y,e("div",null,[e("button",{class:"btn light",onClick:n[0]||(n[0]=R=>{t(r).isVisible?t(c).hide():t(c).show()})},"Toggle Joe"),e("div",N,[o("Joe is visible: "),e("code",null,b(t(r).isVisible),1)])]),e("div",null,[s(t(i),{hljs:t(a),code:B,lang:"html"},null,8,["hljs"])])]),s(j),I]))}});export{U as default};
