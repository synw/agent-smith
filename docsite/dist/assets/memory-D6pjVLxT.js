import{d as j,j as w,b as _,o as x,c as R,a as t,e as b,u as n,H as p,M as h,g as o,t as f}from"./index-CweHuPTs.js";import{u as C,t as M}from"./task1-D8AUjKdk.js";import{u as y}from"./tmem-DpHlNCFj.js";import{t as J,a as A}from"./task4-CRwXj5vz.js";import{u as B}from"./index-DTVJnmFC.js";import"./index-Bda8kKQR.js";import"./_commonjs-dynamic-modules-TDtrdbi3.js";const E=(g=!1)=>{const s=y("job",{runningTask:"",isRunning:!1,runningJob:""},g),a=y("tasks",{},g),l=async()=>{await s.init(),await a.init()},v=async(e,i)=>{await s.set("isRunning",!0),await s.set("runningJob",e),await s.set("runningTask",e),await a.db.clear(),i.forEach(async c=>await a.set(c.id,{isCompleted:!1,params:{},data:{}}))},u=async()=>{await s.set("isRunning",!1)},k=async(e,i,c)=>{const d=await a.get(e);await s.set("runningTask",e),c||(d.params=i),d.data={},await a.set(e,d)};return{tasks:a,job:s,init:l,start:v,finish:u,runTask:async(e,i)=>await k(e,i,!1),reRunTask:async e=>await k(e,{},!0),finishTask:async(e,i,c)=>{const d=await a.get(e);i&&await s.set("runningTask",""),d.isCompleted=i,c&&(d.data=c),await a.set(e,d)}}},S=[M,J,A],N=[C({name:"demo_job",title:"A demo job",tasks:S,tmem:E()})],I=t("div",{class:"prosed"},[t("h1",null,"Memory")],-1),$={class:"flex flex-col space-y-5 mt-5"},H=t("div",null,"The jobs can use a transient memory module to keep track of the tasks results in the Indexeddb database in the browser. Install the module: ",-1),V=t("div",null,"To enable the memory for a job declare it like this:",-1),z=t("div",null,[o("With the memory enabled the input "),t("kbd",null,"params"),o(" of a task and it's output "),t("kbd",null,"data"),o(" will be automatically saved after each task run. Let's create code to run the task 1 with some parameters, and then read the result from memory. ")],-1),D=t("div",null,[o("Note: the job "),t("kbd",null,"init"),o(" has been replaced by "),t("kbd",null,"syncMem"),o(": this automatically synchronize the ephemeral state to the memory. In other words the data from previous task runs will be available in the state ")],-1),L={class:"flex flex-row space-x-3"},W=["disabled"],q=["disabled"],F={class:"flex flex-col space-y-2"},G=t("div",null,"Execute the job, read the memory and then reload the page and read the memory again: the task 1 data will still be there after the first execution. ",-1),K=t("div",null,"This way the data of a previous task can be used as input for a given task. And the tasks can be rerun after a reload. This make it possible to create long running jobs and run only some tasks in it. ",-1),O="npm i @agent-smith/tmem-jobs",P=`import { AgentJob, useAgentJob } from "@agent-smith/jobs";
import { useTmemJobs } from "@agent-smith/tmem-jobs";

const jobs: Array<AgentJob> = [
    useAgentJob({
        name: "demo_job",
        title: "A demo job",
        tasks: tasks,
        tmem: useTmemJobs(),
    }),
];`,Q=`import { onBeforeMount, reactive } from "vue";
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

onBeforeMount(() => job.syncMem());`,U=`<div class="flex flex-row space-x-3">
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
</div>`,nt=j({__name:"memory",setup(g){const s=N[0],a=B(s.tasks.task1.state),l=w({params:{},data:{},isCompleted:!1});async function v(){await s.start();const r={param_task1:"task 1 param value"};await s.runTask("task1",r)}async function u(){const r=await s.tmem.tasks.get("task1");l.params=r.params,l.data=r.data,l.isCompleted=r.isCompleted}async function k(){await s.tmem.tasks.set("task1",{params:{},data:{},isCompleted:!1}),await u()}return _(()=>s.syncMem()),(r,m)=>(x(),R("div",null,[I,t("div",$,[H,t("div",null,[b(n(h),{hljs:n(p),code:O,lang:"html"},null,8,["hljs"])]),V,t("div",null,[b(n(h),{hljs:n(p),code:P,lang:"ts"},null,8,["hljs"])]),z,t("div",null,[b(n(h),{hljs:n(p),code:Q,lang:"ts"},null,8,["hljs"])]),D,t("div",L,[t("button",{class:"btn light",onClick:m[0]||(m[0]=T=>v()),disabled:n(a).isRunning},"Execute",8,W),t("button",{class:"btn light",onClick:m[1]||(m[1]=T=>u())},"Read memory"),t("button",{class:"btn light",onClick:m[2]||(m[2]=T=>k()),disabled:!n(a).isCompleted},"Reset task1 memory",8,q)]),t("div",F,[t("div",null,[o("Task 1 is running: "),t("code",null,f(n(a).isRunning),1)]),t("div",null,[o("Task 1 is completed: "),t("code",null,f(n(a).isCompleted),1)]),t("div",null,[o("Task 1 params: "),t("code",null,f(l.params),1)]),t("div",null,[o("Task 1 data: "),t("code",null,f(l.data),1)])]),G,t("div",null,[b(n(h),{hljs:n(p),code:U,lang:"html"},null,8,["hljs"])]),K])]))}});export{nt as default};
