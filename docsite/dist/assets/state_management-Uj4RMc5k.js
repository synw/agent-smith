import{d as p,y as w,r as T,e as y,o as n,c as o,a as t,g as d,f as e,H as c,M as f,h as i,t as k,F as S,A as C,i as R}from"./index-BQfkzfNJ.js";import{u as _,t as A}from"./task1-DLOr-Jmq.js";import{t as B,a as J}from"./task4-DCU_ahSf.js";const M=[A,B,J],N=[_({name:"demo_job",title:"A demo job",tasks:M})],E={class:"flex flex-col space-y-5 mt-5"},I={class:"flex flex-col space-y-1"},O={class:"flex flex-col space-y-3"},V={class:"flex-row flex w-full items-center"},$={class:"text-2xl mr-2"},F={key:0,class:"warning w-2 h-2"},H={key:1,class:"success w-2 h-2"},L={key:2,class:"semilight w-2 h-2"},P={class:"flex-grow"},U={class:"flex flex-row space-x-3"},W={class:"flex flex-row space-x-2"},D=["disabled"],q=`import { Ref, onBeforeMount } from "vue";
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

onBeforeMount(() => init());`,z=`<div class="flex flex-col space-y-1">
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
</div>`,G=`import { Ref, onBeforeMount, ref } from "vue";
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
}`,K=`<div class="flex flex-row space-x-2">
    <button class="btn light" @click="startTask1()" :disabled="tasksState[0].value.isRunning">Start
        task1</button>
    <button v-if="showConfirmTask1" class="btn success" @click="confirmRunTask1()">Confirm run
        task1</button>
</div>`,tt=p({__name:"state_management",setup(Q){const a=N[0],v=w(a.state),l=new Array,m=T(!1);async function j(){await a.start(),await a.runTask("task1"),await a.runTask("task3"),await new Promise(u=>setTimeout(u,2e3)),await a.runTask("task4"),await a.finish(!0)}async function h(){await a.start(),await a.startTask("task1"),m.value=!0}async function x(){m.value=!1,await a.continueTask(),await a.finishTask(!0)}async function g(){Object.values(a.tasks).forEach(u=>{const s=w(u.state);l.push(s)})}return y(()=>g()),(u,s)=>(n(),o("div",null,[s[10]||(s[10]=t("div",{class:"prosed"},[t("h1",null,"State management")],-1)),s[11]||(s[11]=t("div",{class:"prosed"},[t("h2",null,"Job and tasks UI state")],-1)),t("div",E,[s[6]||(s[6]=t("div",null,"We will use a job with 3 simple tasks in this example to monitor the state of the job and tasks in the UI. We need to map the job and tasks state to be usable in the html template. In a component script:",-1)),t("div",null,[d(e(f),{hljs:e(c),code:q,lang:"ts"},null,8,["hljs"])]),s[7]||(s[7]=t("div",null,"Now we can use the job and tasks state in the html template:",-1)),t("div",null,[d(e(f),{hljs:e(c),code:z,lang:"html"},null,8,["hljs"])]),t("div",I,[t("div",null,[s[3]||(s[3]=i("Job is running: ")),t("code",null,k(e(v).isRunning),1)]),t("div",null,[s[4]||(s[4]=i("Job is completed: ")),t("code",null,k(e(v).isCompleted),1)]),t("div",null,[s[5]||(s[5]=i("A task is running: ")),t("code",null,k(e(v).isRunningTask),1)]),t("div",null,[(n(!0),o(S,null,C(Object.values(e(a).tasks),(r,b)=>(n(),o("div",O,[t("div",V,[t("div",$,[e(l)[b].value.isRunning?(n(),o("div",F)):e(l)[b].value.isCompleted?(n(),o("div",H)):(n(),o("div",L))]),t("div",P,k(r.title),1)])]))),256))])]),t("div",U,[t("button",{class:"btn light",onClick:s[0]||(s[0]=r=>j())},"Execute")]),s[8]||(s[8]=t("div",{class:"prosed"},[t("h2",null,"Tasks with user interactions")],-1)),s[9]||(s[9]=t("div",null,[i("To run a task that must be triggered by a user interaction we need to use "),t("kbd",null,"startTask"),i(". It marks the tasks as started but actually does not execute it. The execution is managed manualy after the user interaction with "),t("kbd",null,"continueTask"),i(". ")],-1)),t("div",null,[d(e(f),{hljs:e(c),code:G,lang:"ts"},null,8,["hljs"])]),t("div",W,[t("button",{class:"btn light",onClick:s[1]||(s[1]=r=>h()),disabled:e(l)[0].value.isRunning},"Start task1",8,D),m.value?(n(),o("button",{key:0,class:"btn success",onClick:s[2]||(s[2]=r=>x())},"Confirm run task1")):R("",!0)]),t("div",null,[d(e(f),{hljs:e(c),code:K,lang:"html"},null,8,["hljs"])])]),s[12]||(s[12]=t("div",{class:"pt-8"},[t("a",{href:"javascript:openLink('/transient_memory/get_started')"},"Next: transient memory")],-1))]))}});export{tt as default};
