import{d,l as m,k as o,o as f,c as u,a as t,e,u as n,H as i,M as c,i as s}from"./index-BhJnANCl.js";import{_ as h}from"./AgentV3.vue_vue_type_style_index_0_lang-BiXQE6wh.js";import"./RobotIcon-BYbFOHW3.js";const g=t("div",{class:"prosed"},[t("h1",null,"The confirm interaction")],-1),p={class:"flex flex-col space-y-5 mt-5"},v=t("div",null,[s("Let's use the confirm interaction. We will start by creating a confirm widget in "),t("kbd",null,"agent/widgets/AgentConfirm.vue"),s(": the template part: ")],-1),_=t("div",null,"The script part:",-1),b=t("div",null,"In the agent code map the component to the state:",-1),A=t("div",null,"Let's prepare the confirm action:",-1),x=t("div",null,"Note that the component to use is passed in the options. Now map the confirm action on the agent's click interaction:",-1),y=t("div",{class:"pt-5"},[t("a",{href:"javascript:openLink('/the_brain/overview')"},"Next: the brain: overview")],-1),j=`<div class="flex flex-col">
    <div v-html="state.text"></div>
    <div class="flex flex-row mt-3 space-x-2 text-sm">
        <button class="btn warning" @click="declineAction()">No</button>
        <button class="btn success" @click="confirmAction()">Yes</button>
    </div>
</div>`,k=`import { agent, state } from "../agent";

async function declineAction() {
    agent.interactions.get().decline()
}

async function confirmAction() {
    agent.interactions.get().confirm()
}`,w=`import { agent } from '@/agent/agent';

const confirmAction = async () => {
    alert("action is confirmed");
    agent.mute();
};

const declineAction = async () => {
    console.log("action is declined");
    agent.mute();
};

const options = {
    component: "AgentConfirm",
    onDecline: declineAction,
};

const setConfirmAction = () => {
    agent.confirm("Do you confirm this action?",
        confirmAction,
        options,
    )
};`,C=`import { onMounted } from "vue";

onMounted(() => {
    agent.show();
    agent.interactions.setKey("click", setConfirmAction);
})`,N=`<div v-if="state.isInteracting === true" class="bubble bubble-bottom-left mr-5 txt-light">
    <agent-base-text v-if="state.component == 'AgentBaseText'"></agent-base-text>
    <agent-confirm v-else-if="state.component == 'AgentConfirm'"></agent-confirm>
</div>`,I=d({__name:"confirm",setup(M){const a=async()=>{alert("action is confirmed"),o.mute()},l={component:"AgentConfirm",onDecline:async()=>{console.log("action is declined"),o.mute()}},r=()=>{o.confirm("Do you confirm this action?",a,l)};return m(()=>{o.show(),o.interactions.setKey("click",r)}),(D,T)=>(f(),u("div",null,[g,t("div",p,[v,t("div",null,[e(n(c),{hljs:n(i),code:j,lang:"html"},null,8,["hljs"])]),_,t("div",null,[e(n(c),{hljs:n(i),code:k,lang:"ts"},null,8,["hljs"])]),b,t("div",null,[e(n(c),{hljs:n(i),code:N,lang:"html"},null,8,["hljs"])]),A,t("div",null,[e(n(c),{hljs:n(i),code:w,lang:"ts"},null,8,["hljs"])]),x,t("div",null,[e(n(c),{hljs:n(i),code:C,lang:"ts"},null,8,["hljs"])])]),e(h),y]))}});export{I as default};
