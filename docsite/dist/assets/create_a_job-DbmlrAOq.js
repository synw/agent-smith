import{d as m,o as h,c as g,a as t,e as l,u as s,H as i,M as r,i as e}from"./index-m-2cGltN.js";import{a as p,u as f,t as j}from"./task1-BlcXdMYC.js";let k=0,b=u=>null;async function v(){return await new Promise(n=>{b=n;let o=1;k=setInterval(()=>{console.log(o,"- running task 2"),++o},1e3)}),{ok:!0}}async function _(){console.log("Aborting task 2"),clearInterval(k),b(!1)}const w=p({id:"task2",title:"Demo task 2",run:v,abort:_}),T=[j,w],A=[f({name:"demo_job",title:"A demo job",tasks:T})],x=t("div",{class:"prosed"},[t("h1",null,"Create a job")],-1),y=t("div",{class:"prosed"},[t("h2",null,"Define a job with tasks")],-1),I={class:"flex flex-col space-y-5 mt-5"},C=t("div",null,"We will start by creating a simple task. Let's define an action function that will run when the task will be executed. ",-1),D=t("div",null,[e("Create an "),t("kbd",null,"agent/jobs/demojob"),e(" folder and a "),t("kbd",null,"task1.ts"),e(" file inside:")],-1),J=t("div",null,[e("The task can accept any input via the "),t("kbd",null,"params"),e(" and can output data. More details about how to manage data with tasks will be provided below. ")],-1),E=t("div",null,[e("Let's create our job with the task in an "),t("kbd",null,"agent/jobs/jobs.ts"),e(" file:")],-1),P=t("div",{class:"prosed"},[t("h2",null,"Execute tasks")],-1),$=t("div",null," To execute a task we need to start the job, and then run the task. A task takes input data and outputs some data: ",-1),L=t("div",null,"Example: open the console to see the output and run execute:",-1),N=t("div",{class:"prosed"},[t("h2",null,"Abort a task")],-1),B=t("div",null,[e(" We will create a second task, simulating an infinite job. In a "),t("kbd",null,"task2.ts"),e(" file with an abort function: ")],-1),M=t("div",null," Let's map the abort function to a button: ",-1),V={class:"flex flex-row space-x-3"},H=t("div",{class:"pt-8"},[t("a",{href:"javascript:openLink('/jobs/config')"},"Next: config")],-1),R=`import { useAgentTask } from "@agent-smith/jobs";

const runTask1 = async (params: any): Promise<Record<string, any>> => {
    console.log("Task 1 is running with input data:", params);
    // simulate 3 seconds of work
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log("Task 1 is finished");
    return { data: [0, 1, 2] }
};

const task1 = useAgentTask({
    id: "task1",
    title: "Test task 1",
    run: runTask1,
});

export { task1 }`,W=`import { AgentTask, AgentJob, useAgentJob } from "@agent-smith/jobs";
import { task1 } from "./task1";

const tasks: Array<AgentTask> = [task1];

const jobs: Array<AgentJob> = [
    useAgentJob({
        name: "demo_job",
        title: "A demo job",
        tasks: tasks
    }),
];

export { jobs }`,S=`async function execute() {
    await job.start();
    const taskInputData = { some: "data" };
    const data = await job.runTask("task1", taskInputData);
    console.log("Task 1 returned data:", data);
    await job.finish(true);
}`,q=`import { AgentTask, useAgentTask } from "@agent-smith/jobs";

let timerId = 0;
let end: (boolean) => void = (boolean) => null;

async function runTask(): Promise<Record<string, any>> {
    // simulate an infinite task
    const promise = new Promise((resolve) => {
        end = resolve;
        let i = 1;
        timerId = setInterval(() => {
            console.log(i, "- running task 2");
            ++i
        }, 1000);
    });
    await promise;
    return { ok: true }
}

async function abortTask() {
    console.log("Aborting task 2");
    clearInterval(timerId);
    end(false);
}

const task2: AgentTask = useAgentTask({
    id: "task2",
    title: "Demo task 2",
    run: runTask,
    abort: abortTask,
});

export { task2 }`,z='<button class="btn warning" @click="jobs[0].abortTask()">Abort</button>',K=m({__name:"create_a_job",setup(u){const n=A[0];async function o(d){await n.start();const a={some:"data"},c=await n.runTask(`task${d}`,a);console.log(`Task ${d} returned data:`,c),await n.finish(!0)}return(d,a)=>(h(),g("div",null,[x,y,t("div",I,[C,D,t("div",null,[l(s(r),{hljs:s(i),code:R,lang:"ts"},null,8,["hljs"])]),J,E,t("div",null,[l(s(r),{hljs:s(i),code:W,lang:"ts"},null,8,["hljs"])]),P,$,t("div",null,[l(s(r),{hljs:s(i),code:S,lang:"ts"},null,8,["hljs"])]),L,t("div",null,[t("button",{class:"btn light",onClick:a[0]||(a[0]=c=>o(1))},"Execute")]),N,B,t("div",null,[l(s(r),{hljs:s(i),code:q,lang:"ts"},null,8,["hljs"])]),M,t("div",V,[t("button",{class:"btn light",onClick:a[1]||(a[1]=c=>o(2))},"Execute"),t("button",{class:"btn warning",onClick:a[2]||(a[2]=c=>s(n).abortTask())},"Abort")]),t("div",null,[l(s(r),{hljs:s(i),code:z,lang:"html"},null,8,["hljs"])])]),H]))}});export{K as default};
