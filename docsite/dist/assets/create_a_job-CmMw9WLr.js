import{d as g,c,o as p,a as s,i as e,g as l,f as n,H as i,M as r}from"./index-BkJOrgP8.js";import{a as f,u as j,t as v}from"./task1-ogSUdPyf.js";let b=0,m=k=>null;async function w(){return await new Promise(a=>{m=a;let o=1;b=setInterval(()=>{console.log(o,"- running task 2"),++o},1e3)}),{ok:!0}}async function T(){console.log("Aborting task 2"),clearInterval(b),m(!1)}const A=f({id:"task2",title:"Demo task 2",run:w,abort:T}),x=[v,A],h=[j({name:"demo_job",title:"A demo job",tasks:x})],y={class:"flex flex-col space-y-5 mt-5"},I={class:"flex flex-row space-x-3"},C=`import { useAgentTask } from "@agent-smith/jobs";

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

export { task1 }`,D=`import { AgentTask, AgentJob, useAgentJob } from "@agent-smith/jobs";
import { task1 } from "./task1";

const tasks: Array<AgentTask> = [task1];

const jobs: Array<AgentJob> = [
    useAgentJob({
        name: "demo_job",
        title: "A demo job",
        tasks: tasks
    }),
];

export { jobs }`,J=`async function execute() {
    await job.start();
    const taskInputData = { some: "data" };
    const data = await job.runTask("task1", taskInputData);
    console.log("Task 1 returned data:", data);
    await job.finish(true);
}`,E=`import { AgentTask, useAgentTask } from "@agent-smith/jobs";

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

export { task2 }`,P='<button class="btn warning" @click="jobs[0].abortTask()">Abort</button>',N=g({__name:"create_a_job",setup(k){const a=h[0];async function o(d){await a.start();const t={some:"data"},u=await a.runTask(`task${d}`,t);console.log(`Task ${d} returned data:`,u),await a.finish(!0)}return(d,t)=>(p(),c("div",null,[t[13]||(t[13]=s("div",{class:"prosed"},[s("h1",null,"Create a job")],-1)),t[14]||(t[14]=s("div",{class:"prosed"},[s("h2",null,"Define a job with tasks")],-1)),s("div",y,[t[3]||(t[3]=s("div",null,"We will start by creating a simple task. Let's define an action function that will run when the task will be executed. ",-1)),t[4]||(t[4]=s("div",null,[e("Create an "),s("kbd",null,"agent/jobs/demojob"),e(" folder and a "),s("kbd",null,"task1.ts"),e(" file inside:")],-1)),s("div",null,[l(n(r),{hljs:n(i),code:C,lang:"ts"},null,8,["hljs"])]),t[5]||(t[5]=s("div",null,[e("The task can accept any input via the "),s("kbd",null,"params"),e(" and can output data. More details about how to manage data with tasks will be provided below. ")],-1)),t[6]||(t[6]=s("div",null,[e("Let's create our job with the task in an "),s("kbd",null,"agent/jobs/jobs.ts"),e(" file:")],-1)),s("div",null,[l(n(r),{hljs:n(i),code:D,lang:"ts"},null,8,["hljs"])]),t[7]||(t[7]=s("div",{class:"prosed"},[s("h2",null,"Execute tasks")],-1)),t[8]||(t[8]=s("div",null," To execute a task we need to start the job, and then run the task. A task takes input data and outputs some data: ",-1)),s("div",null,[l(n(r),{hljs:n(i),code:J,lang:"ts"},null,8,["hljs"])]),t[9]||(t[9]=s("div",null,"Example: open the console to see the output and run execute:",-1)),s("div",null,[s("button",{class:"btn light",onClick:t[0]||(t[0]=u=>o(1))},"Execute")]),t[10]||(t[10]=s("div",{class:"prosed"},[s("h2",null,"Abort a task")],-1)),t[11]||(t[11]=s("div",null,[e(" We will create a second task, simulating an infinite job. In a "),s("kbd",null,"task2.ts"),e(" file with an abort function: ")],-1)),s("div",null,[l(n(r),{hljs:n(i),code:E,lang:"ts"},null,8,["hljs"])]),t[12]||(t[12]=s("div",null," Let's map the abort function to a button: ",-1)),s("div",I,[s("button",{class:"btn light",onClick:t[1]||(t[1]=u=>o(2))},"Execute"),s("button",{class:"btn warning",onClick:t[2]||(t[2]=u=>n(a).abortTask())},"Abort")]),s("div",null,[l(n(r),{hljs:n(i),code:P,lang:"html"},null,8,["hljs"])])]),t[15]||(t[15]=s("div",{class:"pt-8"},[s("a",{href:"javascript:openLink('/jobs/config')"},"Next: config")],-1))]))}});export{N as default};
