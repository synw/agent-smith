import{s as L}from"./textarea.esm-Bm0AQBLZ.js";import{d as R,r as _,j as A,o as h,c as m,a as e,e as l,u as t,H as c,M as u,F as Q,k as U,t as d,f as w,g as p}from"./index-BRk7anpM.js";import{u as N,L as $,a as W,b as E}from"./lm-mqbLQnkx.js";import{u as V}from"./index-iXfWNpia.js";const P=N({name:"kid",localLm:"koboldcpp",templateName:"zephyr"}),G=new $({providerType:"koboldcpp",serverUrl:"http://localhost:5002",onToken:S=>{}}),M=N({name:"corrector",backend:G,templateName:"phi"}),O=W([P,M]),r=E({name:"Bob",modules:[O]}),z=e("div",{class:"prosed"},[e("h1",null,"Multiple experts")],-1),H={class:"flex flex-col space-y-5 mt-5"},I=e("div",null,"We can use different experts for different tasks, in sequence or parallel. An expert is basically a connection to a server that uses a specific model. ",-1),D=e("div",null,"To make the interactive examples work run two local instances of Koboldcpp with different models. We will use small models for this example so that it can work with low memory requirements: ",-1),K=e("div",{class:"prose"},[e("ul",null,[e("li",null,[e("a",{href:"https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF"},"Tinyllama Chat"),p(' (1B) on the first one, as "the kid" expert')]),e("li",null,[e("a",{href:"https://huggingface.co/TheBloke/phi-2-GGUF"},"Phi 2"),p(' (3B) on the first one, as "the kid" expert ')])])],-1),X=e("div",null,[p("Run both servers with the second one using the "),e("kbd",null,"--port 5002"),p(" option. Let's create our experts: ")],-1),Y=e("div",null,"We now have two experts:",-1),Z={class:"txt-light"},ee={key:0},te=e("div",{class:"prose"},[e("h2",null,"Query experts")],-1),oe=e("div",null,"We can query the experts one by one or simultaneously:",-1),se={class:"flex flex-row space-x-3"},ne={key:0,class:"flex flex-row w-full space-x-3"},ae={class:"w-1/2 txt-light"},ie={class:"w-1/2"},le=e("div",null,[p("We use the "),e("kbd",null,"thinkx"),p(" method to query a specific expert:")],-1),re=e("div",null,"The template part:",-1),ce=e("div",{class:"prose"},[e("h2",null,"Example workflow")],-1),ue=e("div",null,"In this example we are going to create a workflow that uses our experts with these steps:",-1),de=e("div",{class:"prose"},[e("ol",null,[e("li",null,"The kid expert will be asked to produce some json"),e("li",null,"The json validity of the output is checked"),e("li",null,"If the output is not valid json, attempt to fix it with the corrector expert")])],-1),pe={class:"flex flex-row space-x-3"},he={key:1,class:"flex flex-row w-full space-x-3"},me={class:"w-1/3 txt-light"},ve={class:"w-2/3 flex flex-col"},xe={class:"mt-3"},fe=e("div",null,"Let's start by creating some functions to validate and fix json:",-1),be=e("div",null,"Now the fix json with retries part and the state management:",-1),ke=e("div",null,"And finally the function to run all steps:",-1),_e=e("div",{class:"pt-5"},[e("a",{href:"javascript:openLink('/the_brain/templates/basics')"},"Next: templates: basics")],-1),we=`import { Lm } from "@locallm/api";
import { useAgentSmith } from "@agent-smith/body";
import { useLmExpert, useAgentBrain } from "@agent-smith/brain";

// first expert
const kid = useLmExpert({
    name: "kid",
    localLm: "koboldcpp",
    templateName: "zephyr",
});
// second expert
const lm = new Lm({
    providerType: "koboldcpp",
    serverUrl: "http://localhost:5002",
    onToken: (t) => { },
});
const corrector = useLmExpert({
    name: "corrector",
    backend: lm,
    templateName: "phi",
});

const bob = useAgentSmith({
    name: "Bob",
    modules: [useAgentBrain([kid, corrector])],
});

export { bob }`,ge=`<div v-for="(expert, i) in bob.brain.experts" class="txt-light">
    {{ i + 1 }}. {{ expert.name }} <span v-if="expert.name == bob.brain.ex.name">(default)</span>
</div>`,ye=`const q1 = ref("Which planet has the most moons? Return the planet name only");

async function check(): Promise<boolean> {
    if (!bob.brain.state.get().isOn) {
        const found = await bob.brain.discover();
        if (!found) {
            console.warn("Can not run query: the inference server is down")
            return false
        }
    }
    return true
}

async function runQ1(expertName: string) {
    await check();
    await bob.thinkx(expertName,
        q1.value, // the prompt from the textarea
        {
            temperature: 0,
            min_p: 0.05,
            max_tokens: 200,
        },
        {
            verbose: true,
        })
}`,je=`<div>
    <Textarea class="w-[50rem] mt-3" v-model="q1" :rows="1" />
</div>
<div class="flex flex-row space-x-3">
    <button class="btn semilight" @click="runQ1('kid');">Run the
        query with the kid</button>
    <button class="btn semilight" @click="runQ1('corrector');">Run the
        query with the corrector</button>
    <button class="btn semilight" @click="runQ1('corrector'); runQ1('kid')">Run the
        query with both in paralel</button>
</div>`,qe=`function validateJson(text: string): boolean {
    try {
        JSON.parse(text);
        return true
    } catch (e) {
        return false
    }
}

async function fixJson(text: string): Promise<string> {
    console.log("Fixing invalid json");
    const _prompt = \`convert this to a valid json array:

\`\`\`
\${text}
\`\`\`\`;
    const resp = await bob.thinkx("corrector",
        _prompt,
        {
            temperature: 0,
            min_p: 0.05,
            max_tokens: 500,
        })
    return resp.text
}`,Je=`import { reactive } from 'vue';

const status = reactive({
    operation: "",
    result: "",
});

async function checkFixJson(text: string, max_attempt = 3, attempt = 0): Promise<{ valid: boolean, text: string }> {
    if (attempt > max_attempt) {
        status.operation = "Unable to validate json";
        return { text: text, valid: false }
    }
    let res = "";
    let done = false;
    status.operation = "Checking json validity";
    const isValid = validateJson(text);
    if (!isValid) {
        status.operation = \`Attempting to fix json, attempt \${attempt + 1}\`;
        const validJson = await fixJson(text);
        if (!validateJson(validJson)) {
            const r = await checkFixJson(text, attempt + 1);
            if (r.valid) {
                done = true;
                res = r.text;
                status.operation = "Fixed the data to valid json:";
                status.result = res;
            }
        } else {
            res = validJson;
            status.result = res;
            done = true;
            status.operation = "Fixed the data to valid json:"
        }
    } else {
        done = true;
        res = text;
        status.result = res;
        status.operation = "Fixed the data to valid json:"
    }
    return { text: res, valid: done }
}`,Fe=`async function runQ2() {
    await check();
    status.result = "";
    status.operation = ""
    console.log("Step 1: query with the kid");
    const resp = await bob.thinkx("kid",
        q2.value,  // the prompt
        {
            temperature: 0,
            min_p: 0.05,
            max_tokens: 500,
        });
    console.log("Result:", resp.text);
    console.log("Step 2: validating json");
    const { text, valid } = await checkFixJson(resp.text);
    if (valid) {
        console.log("Valid json:", text);
    } else {
        console.warn("Unable to fix json:", text)
    }
}`,Be=R({__name:"multiple_experts",setup(S){const v=_("q1"),g=V(r.brain.expert("kid").stream),T=V(r.brain.expert("corrector").stream),a=A({operation:"",result:""}),b=_("Which planet has the most moons? Return the planet name only"),k=_("List the 3 biggest websites in json");async function y(){return!r.brain.state.get().isOn&&!await r.brain.discover()?(console.warn("Can not run query: the inference server is down"),!1):!0}async function x(n){await y(),v.value="q1",await r.thinkx(n,b.value,{temperature:0,min_p:.05,repeatPenalty:1.1,max_tokens:200},{verbose:!0})}function j(n){try{return JSON.parse(n),!0}catch{return!1}}async function B(n){console.log("Fixing invalid json");const o=`convert this to a valid json array:

\`\`\`
${n}
\`\`\``;return(await r.thinkx("corrector",o,{temperature:0,min_p:.05,max_tokens:500})).text}async function q(n,o=3,s=0){if(s>o)return a.operation="Unable to validate json",{text:n,valid:!1};let i="",f=!1;if(a.operation="Checking json validity",j(n))f=!0,i=n,a.result=i,a.operation="Fixed the data to valid json:";else{a.operation=`Attempting to fix json, attempt ${s+1}`;const J=await B(n);if(j(J))i=J,a.result=i,f=!0,a.operation="Fixed the data to valid json:";else{const F=await q(n,s+1);F.valid&&(f=!0,i=F.text,a.operation="Fixed the data to valid json:",a.result=i)}}return{text:i,valid:f}}async function C(){await y(),v.value="q2",a.result="",a.operation="",console.log("Step 1: query with the kid");const n=await r.thinkx("kid",k.value,{temperature:0,min_p:.05,max_tokens:500});console.log("Result:",n.text),console.log("Step 2: validating json");const{text:o,valid:s}=await q(n.text);s?console.log("Valid json:",o):console.warn("Unable to fix json:",o)}return(n,o)=>(h(),m("div",null,[z,e("div",H,[I,D,K,X,e("div",null,[l(t(u),{hljs:t(c),code:we,lang:"ts"},null,8,["hljs"])]),Y,e("div",null,[(h(!0),m(Q,null,U(t(r).brain.experts,(s,i)=>(h(),m("div",Z,[p(d(i+1)+". "+d(s.name)+" ",1),s.name==t(r).brain.ex.name?(h(),m("span",ee,"(current default)")):w("",!0)]))),256))]),e("div",null,[l(t(u),{hljs:t(c),code:ge,lang:"html"},null,8,["hljs"])]),te,oe,e("div",null,[l(t(L),{class:"w-[50rem] mt-3",modelValue:b.value,"onUpdate:modelValue":o[0]||(o[0]=s=>b.value=s),rows:1},null,8,["modelValue"])]),e("div",se,[e("button",{class:"btn semilight",onClick:o[1]||(o[1]=s=>{x("kid")})},"Run the query with the kid"),e("button",{class:"btn semilight",onClick:o[2]||(o[2]=s=>{x("corrector")})},"Run the query with the corrector"),e("button",{class:"btn semilight",onClick:o[3]||(o[3]=s=>{x("corrector"),x("kid")})},"Run the query with both in paralel")]),v.value=="q1"?(h(),m("div",ne,[e("div",ae,d(t(g)),1),e("div",ie,d(t(T)),1)])):w("",!0),le,e("div",null,[l(t(u),{hljs:t(c),code:ye,lang:"ts"},null,8,["hljs"])]),re,e("div",null,[l(t(u),{hljs:t(c),code:je,lang:"html"},null,8,["hljs"])]),ce,ue,de,e("div",null,[l(t(L),{class:"w-[50rem] mt-3",modelValue:k.value,"onUpdate:modelValue":o[4]||(o[4]=s=>k.value=s),rows:1,disabled:""},null,8,["modelValue"])]),e("div",pe,[e("button",{class:"btn semilight",onClick:o[5]||(o[5]=s=>{C()})},"Run the steps")]),v.value=="q2"?(h(),m("div",he,[e("div",me,d(t(g)),1),e("div",ve,[e("div",null,d(a.operation),1),e("div",xe,d(a.result),1)])])):w("",!0),fe,e("div",null,[l(t(u),{hljs:t(c),code:qe,lang:"ts"},null,8,["hljs"])]),be,e("div",null,[l(t(u),{hljs:t(c),code:Je,lang:"ts"},null,8,["hljs"])]),ke,e("div",null,[l(t(u),{hljs:t(c),code:Fe,lang:"ts"},null,8,["hljs"])]),_e])]))}});export{Be as default};
