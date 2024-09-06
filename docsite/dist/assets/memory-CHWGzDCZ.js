import{m as y,d as j,x as w,p as x,b as R,o as C,c as M,a as t,e as b,u as o,H as p,M as f,h as i,t as g}from"./index-BMtjbDYc.js";import{u as J,t as A}from"./task1-DXJslRWZ.js";import{t as B,a as E}from"./task4-DXJM7BAm.js";const S=(v=!1)=>{const a=y("job",{runningTask:"",isRunning:!1,runningJob:""},v),e=y("tasks",{},v),r=async()=>{await a.init(),await e.init()},h=async(n,l)=>{await a.set("isRunning",!0),await a.set("runningJob",n),await a.set("runningTask",n),await e.db.clear(),l.forEach(async u=>await e.set(u.id,{isCompleted:!1,params:{},data:{}}))},k=async()=>{await a.set("isRunning",!1)},c=async(n,l,u)=>{const d=await e.get(n);await a.set("runningTask",n),u||(d.params=l),d.data={},await e.set(n,d)};return{tasks:e,job:a,init:r,start:h,finish:k,runTask:async(n,l)=>await c(n,l,!1),reRunTask:async n=>await c(n,{},!0),finishTask:async(n,l,u)=>{const d=await e.get(n);l&&await a.set("runningTask",""),d.isCompleted=l,u&&(d.data=u),await e.set(n,d)}}},N=[A,B,E],I=[J({name:"demo_job",title:"A demo job",tasks:N,tmem:S()})],$={class:"flex flex-col space-y-5 mt-5"},H={class:"flex flex-row space-x-3"},V=["disabled"],z=["disabled"],D={class:"flex flex-col space-y-2"},L="npm i @agent-smith/tmem-jobs",W=`import { AgentJob, useAgentJob } from "@agent-smith/jobs";
import { useTmemJobs } from "@agent-smith/tmem-jobs";

const jobs: Array<AgentJob> = [
    useAgentJob({
        name: "demo_job",
        title: "A demo job",
        tasks: tasks,
        tmem: useTmemJobs(),
    }),
];`,q=`import { onBeforeMount, reactive } from "vue";
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

onBeforeMount(() => job.syncMem());`,F=`<div class="flex flex-row space-x-3">
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
</div>`,P=j({__name:"memory",setup(v){const a=I[0],e=w(a.tasks.task1.state),r=x({params:{},data:{},isCompleted:!1});async function h(){await a.start();const m={param_task1:"task 1 param value"};await a.runTask("task1",m)}async function k(){const m=await a.tmem.tasks.get("task1");r.params=m.params,r.data=m.data,r.isCompleted=m.isCompleted}async function c(){await a.tmem.tasks.set("task1",{params:{},data:{},isCompleted:!1}),await k()}return R(()=>a.syncMem()),(m,s)=>(C(),M("div",null,[s[13]||(s[13]=t("div",{class:"prosed"},[t("h1",null,"Memory")],-1)),t("div",$,[s[7]||(s[7]=t("div",null,"The jobs can use a transient memory module to keep track of the tasks results in the Indexeddb database in the browser. Install the module: ",-1)),t("div",null,[b(o(f),{hljs:o(p),code:L,lang:"html"},null,8,["hljs"])]),s[8]||(s[8]=t("div",null,"To enable the memory for a job declare it like this:",-1)),t("div",null,[b(o(f),{hljs:o(p),code:W,lang:"ts"},null,8,["hljs"])]),s[9]||(s[9]=t("div",null,[i("With the memory enabled the input "),t("kbd",null,"params"),i(" of a task and it's output "),t("kbd",null,"data"),i(" will be automatically saved after each task run. Let's create code to run the task 1 with some parameters, and then read the result from memory. ")],-1)),t("div",null,[b(o(f),{hljs:o(p),code:q,lang:"ts"},null,8,["hljs"])]),s[10]||(s[10]=t("div",null,[i("Note: the job "),t("kbd",null,"init"),i(" has been replaced by "),t("kbd",null,"syncMem"),i(": this automatically synchronize the ephemeral state to the memory. In other words the data from previous task runs will be available in the state ")],-1)),t("div",H,[t("button",{class:"btn light",onClick:s[0]||(s[0]=T=>h()),disabled:o(e).isRunning},"Execute",8,V),t("button",{class:"btn light",onClick:s[1]||(s[1]=T=>k())},"Read memory"),t("button",{class:"btn light",onClick:s[2]||(s[2]=T=>c()),disabled:!o(e).isCompleted},"Reset task1 memory",8,z)]),t("div",D,[t("div",null,[s[3]||(s[3]=i("Task 1 is running: ")),t("code",null,g(o(e).isRunning),1)]),t("div",null,[s[4]||(s[4]=i("Task 1 is completed: ")),t("code",null,g(o(e).isCompleted),1)]),t("div",null,[s[5]||(s[5]=i("Task 1 params: ")),t("code",null,g(r.params),1)]),t("div",null,[s[6]||(s[6]=i("Task 1 data: ")),t("code",null,g(r.data),1)])]),s[11]||(s[11]=t("div",null,"Execute the job, read the memory and then reload the page and read the memory again: the task 1 data will still be there after the first execution. ",-1)),t("div",null,[b(o(f),{hljs:o(p),code:F,lang:"html"},null,8,["hljs"])]),s[12]||(s[12]=t("div",null,"This way the data of a previous task can be used as input for a given task. And the tasks can be rerun after a reload. This make it possible to create long running jobs and run only some tasks in it. ",-1))])]))}});export{P as default};
