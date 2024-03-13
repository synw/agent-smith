import{d as m,i as d,o as f,c as u,a as t,e as o,u as e,H as n,M as i,g as s}from"./index-CweHuPTs.js";import{_ as h}from"./AgentJoeV3.vue_vue_type_style_index_0_lang-srecX9M0.js";import{a as c}from"./agent-pKjF91oY.js";import"./RobotIcon-by7nlBQk.js";import"./_plugin-vue_export-helper-DlAUqK2U.js";import"./lm-Ctwc89wI.js";import"./index-Bda8kKQR.js";import"./_commonjs-dynamic-modules-TDtrdbi3.js";import"./index-DTVJnmFC.js";const p=t("div",{class:"prosed"},[t("h1",null,"The confirm interaction")],-1),g={class:"flex flex-col space-y-5 mt-5"},v=t("div",null,[s("Let's use the confirm interaction. We will start by creating a confirm widget in "),t("kbd",null,"agent/widgets/AgentConfirm.vue"),s(": the template part: ")],-1),_=t("div",null,"The script part:",-1),j=t("div",null,"In the agent code map the component to the state:",-1),b=t("div",null,"Let's prepare the confirm action:",-1),A=t("div",null,"Note that the component to use is passed in the options. Now map the confirm action on the agent's click interaction:",-1),x=t("div",{class:"pt-5"},[t("a",{href:"javascript:openLink('/the_brain/overview')"},"Next: the brain: overview")],-1),y=`<div class="flex flex-col">
    <div v-html="joeState.text"></div>
    <div class="flex flex-row mt-3 space-x-2 text-sm">
        <button class="btn warning" @click="declineAction()">No</button>
        <button class="btn success" @click="confirmAction()">Yes</button>
    </div>
</div>`,w=`import { joe, joeState } from "../agent";

async function declineAction() {
    joe.interactions.get().decline()
}

async function confirmAction() {
    joe.interactions.get().confirm()
}`,k=`import { joe } from '@/agent/agent';

const confirmAction = async () => {
    alert("action is confirmed");
    joe.mute();
};

const declineAction = async () => {
    console.log("action is declined");
    joe.mute();
};

const options = {
    component: "AgentConfirm",
    onDecline: declineAction,
};

const setConfirmAction = () => {
    joe.confirm("Do you confirm this action?",
        confirmAction,
        options,
    )
};`,C=`import { onMounted } from "vue";

onMounted(() => {
    joe.show();
    joe.interactions.setKey("click", setConfirmAction);
})`,N=`<div v-if="joeState.isInteracting === true" class="bubble bubble-bottom-left mr-5 txt-light">
    <agent-base-text v-if="joeState.component == 'AgentBaseText'"></agent-base-text>
    <agent-confirm v-else-if="joeState.component == 'AgentConfirm'"></agent-confirm>
</div>`,Y=m({__name:"confirm",setup(S){const l=async()=>{alert("action is confirmed"),c.mute()},a={component:"AgentConfirm",onDecline:async()=>{console.log("action is declined"),c.mute()}},r=()=>{c.confirm("Do you confirm this action?",l,a)};return d(()=>{c.show(),c.interactions.setKey("click",r)}),(B,D)=>(f(),u("div",null,[p,t("div",g,[v,t("div",null,[o(e(i),{hljs:e(n),code:y,lang:"html"},null,8,["hljs"])]),_,t("div",null,[o(e(i),{hljs:e(n),code:w,lang:"ts"},null,8,["hljs"])]),j,t("div",null,[o(e(i),{hljs:e(n),code:N,lang:"html"},null,8,["hljs"])]),b,t("div",null,[o(e(i),{hljs:e(n),code:k,lang:"ts"},null,8,["hljs"])]),A,t("div",null,[o(e(i),{hljs:e(n),code:C,lang:"ts"},null,8,["hljs"])])]),o(h),x]))}});export{Y as default};
