import{d,l as f,k as i,c as u,o as g,a as t,g as o,i as l,f as e,H as s,M as c}from"./index-_xxmxxzb.js";import{_ as p}from"./AgentV3.vue_vue_type_style_index_0_lang-CzCDHBEM.js";import"./RobotIcon-D3Pi08bE.js";const v={class:"flex flex-col space-y-5 mt-5"},h=`<div class="flex flex-col">
    <div v-html="state.text"></div>
    <div class="flex flex-row mt-3 space-x-2 text-sm">
        <button class="btn warning" @click="declineAction()">No</button>
        <button class="btn success" @click="confirmAction()">Yes</button>
    </div>
</div>`,b=`import { agent, state } from "../agent";

async function declineAction() {
    agent.interactions.get().decline()
}

async function confirmAction() {
    agent.interactions.get().confirm()
}`,A=`import { agent } from '@/agent/agent';

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
};`,x=`import { onMounted } from "vue";

onMounted(() => {
    agent.show();
    agent.interactions.setKey("click", setConfirmAction);
})`,y=`<div v-if="state.isInteracting === true" class="bubble bubble-bottom-left mr-5 txt-light">
    <agent-base-text v-if="state.component == 'AgentBaseText'"></agent-base-text>
    <agent-confirm v-else-if="state.component == 'AgentConfirm'"></agent-confirm>
</div>`,B=d({__name:"confirm",setup(j){const a=async()=>{alert("action is confirmed"),i.mute()},r={component:"AgentConfirm",onDecline:async()=>{console.log("action is declined"),i.mute()}},m=()=>{i.confirm("Do you confirm this action?",a,r)};return f(()=>{i.show(),i.interactions.setKey("click",m)}),(w,n)=>(g(),u("div",null,[n[5]||(n[5]=t("div",{class:"prosed"},[t("h1",null,"The confirm interaction")],-1)),t("div",v,[n[0]||(n[0]=t("div",null,[l("Let's use the confirm interaction. We will start by creating a confirm widget in "),t("kbd",null,"agent/widgets/AgentConfirm.vue"),l(": the template part: ")],-1)),t("div",null,[o(e(c),{hljs:e(s),code:h,lang:"html"},null,8,["hljs"])]),n[1]||(n[1]=t("div",null,"The script part:",-1)),t("div",null,[o(e(c),{hljs:e(s),code:b,lang:"ts"},null,8,["hljs"])]),n[2]||(n[2]=t("div",null,"In the agent code map the component to the state:",-1)),t("div",null,[o(e(c),{hljs:e(s),code:y,lang:"html"},null,8,["hljs"])]),n[3]||(n[3]=t("div",null,"Let's prepare the confirm action:",-1)),t("div",null,[o(e(c),{hljs:e(s),code:A,lang:"ts"},null,8,["hljs"])]),n[4]||(n[4]=t("div",null,"Note that the component to use is passed in the options. Now map the confirm action on the agent's click interaction:",-1)),t("div",null,[o(e(c),{hljs:e(s),code:x,lang:"ts"},null,8,["hljs"])])]),o(p),n[6]||(n[6]=t("div",{class:"pt-5"},[t("a",{href:"javascript:openLink('/the_brain/overview')"},"Next: the brain: overview")],-1))]))}});export{B as default};
