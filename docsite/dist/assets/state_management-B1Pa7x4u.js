import{d as _,r as g,b as T,o as n,c as o,a as t,e as u,u as s,H as d,M as f,g as i,t as k,F as y,k as S,f as C}from"./index-CweHuPTs.js";import{u as R,t as A}from"./task1-D8AUjKdk.js";import{t as B,a as J}from"./task4-CRwXj5vz.js";import{u as b}from"./index-DTVJnmFC.js";import"./index-Bda8kKQR.js";const M=[A,B,J],N=[R({name:"demo_job",title:"A demo job",tasks:M})],E=t("div",{class:"prosed"},[t("h1",null,"State management")],-1),I=t("div",{class:"prosed"},[t("h2",null,"Job and tasks UI state")],-1),O={class:"flex flex-col space-y-5 mt-5"},V=t("div",null,"We will use a job with 3 simple tasks in this example to monitor the state of the job and tasks in the UI. We need to map the job and tasks state to be usable in the html template. In a component script:",-1),$=t("div",null,"Now we can use the job and tasks state in the html template:",-1),F={class:"flex flex-col space-y-1"},H={class:"flex flex-col space-y-3"},L={class:"flex-row flex w-full items-center"},P={class:"text-2xl mr-2"},U={key:0,class:"warning w-2 h-2"},W={key:1,class:"success w-2 h-2"},D={key:2,class:"semilight w-2 h-2"},q={class:"flex-grow"},z={class:"flex flex-row space-x-3"},G=t("div",{class:"prosed"},[t("h2",null,"Tasks with user interactions")],-1),K=t("div",null,[i("To run a task that must be triggered by a user interaction we need to use "),t("kbd",null,"startTask"),i(". It marks the tasks as started but actually does not execute it. The execution is managed manualy after the user interaction with "),t("kbd",null,"continueTask"),i(". ")],-1),Q={class:"flex flex-row space-x-2"},X=["disabled"],Y=t("div",{class:"pt-8"},[t("a",{href:"javascript:openLink('/transient_memory/get_started')"},"Next: transient memory")],-1),Z=`import { Ref, onBeforeMount } from "vue";
import { useStore } from "@nanostores/vue";
import { AgentTaskState } from "@agent-smith/jobs";
import { jobs } from "@/agent/jobs/demo_job/index2";

const job = jobs[0];
const jobState = useStore(job.state);
const tasksState = new Array<Ref<AgentTaskState>>();

async function execute() {
    await job.start();
    await job.runTask("task1");
    await job.runTask("task3");
    await new Promise(resolve => setTimeout(resolve, 2000));
    await job.runTask("task4");
    await job.finish(true); // true is to flag the job as successful
}

async function init() {
    Object.values(job.tasks).forEach((t) => {
        const ts = useStore(t.state);
        tasksState.push(ts);
    })
}

onBeforeMount(() => init());`,tt=`<div class="flex flex-col space-y-1">
    <div>Job is running: <code>{{ jobState.isRunning }}</code></div>
    <div>A task is running: <code>{{ jobState.isRunningTask }}</code></div>
    <div>
        <div v-for="(task, i) in  Object.values(job.tasks) " class="flex flex-col space-y-3">
            <div class="flex-row flex w-full items-center">
                <div class="text-2xl mr-2">
                    <div class="warning w-2 h-2" v-if="tasksState[i].value.isRunning"></div>
                    <div class="success w-2 h-2" v-else-if="tasksState[i].value.isCompleted">
                    </div>
                    <div v-else class="semilight w-2 h-2"></div>
                </div>
                <div class="flex-grow">{{ task.title }}</div>
            </div>
        </div>
    </div>
</div>
<div class="flex flex-row space-x-3">
    <button class="btn light" @click="execute()">Execute</button>
</div>`,st=`import { Ref, onBeforeMount, ref } from "vue";
import { jobs } from "@/agent/jobs/demo_job/index2";

const job = jobs[0];
const showConfirmTask1 = ref(false);

async function startTask1() {
    await job.start();
    await job.startTask("task1");
    showConfirmTask1.value = true;
}

async function confirmRunTask1() {
    showConfirmTask1.value = false;
    await job.continueTask();
    await job.finishTask(true);
}`,et=`<div class="flex flex-row space-x-2">
    <button class="btn light" @click="startTask1()" :disabled="tasksState[0].value.isRunning">Start
        task1</button>
    <button v-if="showConfirmTask1" class="btn success" @click="confirmRunTask1()">Confirm run
        task1</button>
</div>`,rt=_({__name:"state_management",setup(at){const e=N[0],m=b(e.state),l=new Array,v=g(!1);async function w(){await e.start(),await e.runTask("task1"),await e.runTask("task3"),await new Promise(c=>setTimeout(c,2e3)),await e.runTask("task4"),await e.finish(!0)}async function j(){await e.start(),await e.startTask("task1"),v.value=!0}async function p(){v.value=!1,await e.continueTask(),await e.finishTask(!0)}async function x(){Object.values(e.tasks).forEach(c=>{const a=b(c.state);l.push(a)})}return T(()=>x()),(c,a)=>(n(),o("div",null,[E,I,t("div",O,[V,t("div",null,[u(s(f),{hljs:s(d),code:Z,lang:"ts"},null,8,["hljs"])]),$,t("div",null,[u(s(f),{hljs:s(d),code:tt,lang:"html"},null,8,["hljs"])]),t("div",F,[t("div",null,[i("Job is running: "),t("code",null,k(s(m).isRunning),1)]),t("div",null,[i("Job is completed: "),t("code",null,k(s(m).isCompleted),1)]),t("div",null,[i("A task is running: "),t("code",null,k(s(m).isRunningTask),1)]),t("div",null,[(n(!0),o(y,null,S(Object.values(s(e).tasks),(r,h)=>(n(),o("div",H,[t("div",L,[t("div",P,[s(l)[h].value.isRunning?(n(),o("div",U)):s(l)[h].value.isCompleted?(n(),o("div",W)):(n(),o("div",D))]),t("div",q,k(r.title),1)])]))),256))])]),t("div",z,[t("button",{class:"btn light",onClick:a[0]||(a[0]=r=>w())},"Execute")]),G,K,t("div",null,[u(s(f),{hljs:s(d),code:st,lang:"ts"},null,8,["hljs"])]),t("div",Q,[t("button",{class:"btn light",onClick:a[1]||(a[1]=r=>j()),disabled:s(l)[0].value.isRunning},"Start task1",8,X),v.value?(n(),o("button",{key:0,class:"btn success",onClick:a[2]||(a[2]=r=>p())},"Confirm run task1")):C("",!0)]),t("div",null,[u(s(f),{hljs:s(d),code:et,lang:"html"},null,8,["hljs"])])]),Y]))}});export{rt as default};
