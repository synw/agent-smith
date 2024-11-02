import{p as j,d as w,y as x,q as R,e as C,o as M,c as J,a as t,g as p,f as o,H as f,M as g,h as r,t as v}from"./index-vf8raKft.js";import{u as A,t as B}from"./task1-DLOr-Jmq.js";import{t as E,a as S}from"./task4-DCU_ahSf.js";const N=(h=!1)=>{const a=j("job",{runningTask:"",isRunning:!1,runningJob:""},h),e=j("tasks",{},h),m=async()=>{await a.init(),await e.init()},y=async(n,i)=>{await a.set("isRunning",!0),await a.set("runningJob",n),await a.set("runningTask",n),await e.db.clear(),i.forEach(async l=>await e.set(l.id,{isCompleted:!1,params:{},conf:{},data:{}}))},k=async()=>{await a.set("isRunning",!1)},c=async(n,i,l,u={})=>{const b=await e.get(n);await a.set("runningTask",n),l||(b.params=i,b.conf=u),b.data={},await e.set(n,b)};return{tasks:e,job:a,init:m,start:y,finish:k,runTask:async(n,i,l={})=>await c(n,i,!1,l),reRunTask:async(n,i,l={})=>await c(n,i,!0,l),finishTask:async(n,i,l)=>{const u=await e.get(n);i&&await a.set("runningTask",""),u.isCompleted=i,l&&(u.data=l),await e.set(n,u)}}},I=[B,E,S],$=[A({name:"demo_job",title:"A demo job",tasks:I,tmem:N()})],H={class:"flex flex-col space-y-5 mt-5"},V={class:"flex flex-row space-x-3"},q=["disabled"],z=["disabled"],D={class:"flex flex-col space-y-2"},L="npm i @agent-smith/tmem-jobs",W=`import { AgentJob, useAgentJob } from "@agent-smith/jobs";
import { useTmemJobs } from "@agent-smith/tmem-jobs";

const jobs: Array<AgentJob> = [
    useAgentJob({
        name: "demo_job",
        title: "A demo job",
        tasks: tasks,
        tmem: useTmemJobs(),
    }),
];`,F=`import { onBeforeMount, reactive } from "vue";
import { useStore } from "@nanostores/vue";
import { TaskMem } from "@agent-smith/tmem-jobs";
import { jobs } from "@/agent/jobs/demo_job/index3";

const job = jobs[0];
// ui state
const task1state = useStore(job.tasks["task1"].state);
const task1Result = reactive<TaskMem>({
    params: {},
    data: {},
    isCompleted: false,
});

async function executeTask1() {
    await job.start();
    const params = { "param_task1": "task 1 param value" };
    await job.runTask("task1", params);
}

async function readTask1Mem() {
    // read from memory
    const res = await job.tmem.tasks.get<TaskMem>("task1");
    // map to ui
    task1Result.params = res.params;
    task1Result.data = res.data;
    task1Result.isCompleted = res.isCompleted;
}

async function resetTask1() {
    await job.tmem.tasks.set("task1", {
        params: {},
        data: {},
        isCompleted: false,
    });
    await readTask1Mem();
}

onBeforeMount(() => job.syncMem());`,G=`<div class="flex flex-row space-x-3">
    <button class="btn light" @click="executeTask1()" :disabled="task1state.isRunning">Execute</button>
    <button class="btn light" @click="readTask1Mem()">Read
        memory</button>
    <button class="btn light" @click="resetTask1()" :disabled="!task1state.isCompleted">Reset
        task1 memory</button>
</div>
<div class="flex flex-col space-y-2">
    <div>Task 1 is running: <code>{{ task1state.isRunning }}</code></div>
    <div>Task 1 is completed: <code>{{ task1state.isCompleted }}</code></div>
    <div>Task 1 params: <code>{{ task1Result.params }}</code></div>
    <div>Task 1 data: <code>{{ task1Result.data }}</code></div>
</div>`,Q=w({__name:"memory",setup(h){const a=$[0],e=x(a.tasks.task1.state),m=R({params:{},data:{},isCompleted:!1});async function y(){await a.start();const d={param_task1:"task 1 param value"};await a.runTask("task1",d)}async function k(){const d=await a.tmem.tasks.get("task1");m.params=d.params,m.data=d.data,m.isCompleted=d.isCompleted}async function c(){await a.tmem.tasks.set("task1",{params:{},data:{},isCompleted:!1}),await k()}return C(()=>a.syncMem()),(d,s)=>(M(),J("div",null,[s[13]||(s[13]=t("div",{class:"prosed"},[t("h1",null,"Memory")],-1)),t("div",H,[s[7]||(s[7]=t("div",null,"The jobs can use a transient memory module to keep track of the tasks results in the Indexeddb database in the browser. Install the module: ",-1)),t("div",null,[p(o(g),{hljs:o(f),code:L,lang:"html"},null,8,["hljs"])]),s[8]||(s[8]=t("div",null,"To enable the memory for a job declare it like this:",-1)),t("div",null,[p(o(g),{hljs:o(f),code:W,lang:"ts"},null,8,["hljs"])]),s[9]||(s[9]=t("div",null,[r("With the memory enabled the input "),t("kbd",null,"params"),r(" of a task and it's output "),t("kbd",null,"data"),r(" will be automatically saved after each task run. Let's create code to run the task 1 with some parameters, and then read the result from memory. ")],-1)),t("div",null,[p(o(g),{hljs:o(f),code:F,lang:"ts"},null,8,["hljs"])]),s[10]||(s[10]=t("div",null,[r("Note: the job "),t("kbd",null,"init"),r(" has been replaced by "),t("kbd",null,"syncMem"),r(": this automatically synchronize the ephemeral state to the memory. In other words the data from previous task runs will be available in the state ")],-1)),t("div",V,[t("button",{class:"btn light",onClick:s[0]||(s[0]=T=>y()),disabled:o(e).isRunning},"Execute",8,q),t("button",{class:"btn light",onClick:s[1]||(s[1]=T=>k())},"Read memory"),t("button",{class:"btn light",onClick:s[2]||(s[2]=T=>c()),disabled:!o(e).isCompleted},"Reset task1 memory",8,z)]),t("div",D,[t("div",null,[s[3]||(s[3]=r("Task 1 is running: ")),t("code",null,v(o(e).isRunning),1)]),t("div",null,[s[4]||(s[4]=r("Task 1 is completed: ")),t("code",null,v(o(e).isCompleted),1)]),t("div",null,[s[5]||(s[5]=r("Task 1 params: ")),t("code",null,v(m.params),1)]),t("div",null,[s[6]||(s[6]=r("Task 1 data: ")),t("code",null,v(m.data),1)])]),s[11]||(s[11]=t("div",null,"Execute the job, read the memory and then reload the page and read the memory again: the task 1 data will still be there after the first execution. ",-1)),t("div",null,[p(o(g),{hljs:o(f),code:G,lang:"html"},null,8,["hljs"])]),s[12]||(s[12]=t("div",null,"This way the data of a previous task can be used as input for a given task. And the tasks can be rerun after a reload. This make it possible to create long running jobs and run only some tasks in it. ",-1))])]))}});export{Q as default};
