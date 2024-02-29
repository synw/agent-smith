import{d,i as m,o as f,c as u,a as o,e as n,u as t,H as i,M as c,g as s}from"./index-CboZIT6v.js";import{_ as h}from"./AgentJoeV3.vue_vue_type_style_index_0_lang-BZstlpzB.js";import{a as e}from"./agent-BFtiMqbc.js";import"./RobotIcon-BQcGCiSa.js";import"./_plugin-vue_export-helper-DlAUqK2U.js";import"./lm-BizhkHiD.js";import"./index-BZxdWYOY.js";const p=o("div",{class:"prosed"},[o("h1",null,"The confirm interaction")],-1),v={class:"flex flex-col space-y-5 mt-5"},_=o("div",null,[s("Let's use the confirm interaction. We will start by creating a confirm widget in "),o("kbd",null,"agent/widgets/AgentConfirm.vue"),s(": the template part: ")],-1),g=o("div",null,"The script part:",-1),j=o("div",null,"Let's prepare the confirm action:",-1),A=o("div",null,"Note that the component to use is passed in the options. Now map the confirm action on the agent's click interaction:",-1),x=o("div",{class:"pt-5"},[o("a",{href:"javascript:openLink('/the_brain/overview')"},"Next: the brain: overview")],-1),b=`<div class="flex flex-col">
    <div v-html="joeState.text"></div>
    <div class="flex flex-row mt-3 space-x-2 text-sm">
        <button class="btn warning" @click="declineAction()">No</button>
        <button class="btn success" @click="confirmAction()">Yes</button>
    </div>
</div>`,w=`import { joe, joeState } from "../agent";

function declineAction() {
    joe.interactions.get().decline()
}

function confirmAction() {
    joe.interactions.get().confirm()
}`,k=`import { joe } from '@/agent/agent';

const confirmAction = () => {
    alert("action is confirmed");
    joe.mute();
};

const declineAction = () => {
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
})`,E=d({__name:"confirm",setup(N){const l=()=>{alert("action is confirmed"),e.mute()},a={component:"AgentConfirm",onDecline:()=>{console.log("action is declined"),e.mute()}},r=()=>{e.confirm("Do you confirm this action?",l,a)};return m(()=>{e.show(),e.interactions.setKey("click",r)}),(M,D)=>(f(),u("div",null,[p,o("div",v,[_,o("div",null,[n(t(c),{hljs:t(i),code:b,lang:"html"},null,8,["hljs"])]),g,o("div",null,[n(t(c),{hljs:t(i),code:w,lang:"ts"},null,8,["hljs"])]),j,o("div",null,[n(t(c),{hljs:t(i),code:k,lang:"ts"},null,8,["hljs"])]),A,o("div",null,[n(t(c),{hljs:t(i),code:C,lang:"ts"},null,8,["hljs"])])]),n(h),x]))}});export{E as default};
