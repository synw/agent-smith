import{s as L}from"./textarea.esm-DhbHtyuO.js";import{d as R,r as _,j as A,o as h,c as m,a as t,e as l,u as e,H as c,M as u,F as Q,k as U,t as d,f as w,g as p}from"./index-CweHuPTs.js";import{u as N,L as $,a as W,b as E}from"./lm-Ctwc89wI.js";import{u as V}from"./index-DTVJnmFC.js";import"./index-Bda8kKQR.js";import"./_commonjs-dynamic-modules-TDtrdbi3.js";const G=N({name:"kid",localLm:"koboldcpp",templateName:"zephyr"}),O=new $({providerType:"koboldcpp",serverUrl:"http://localhost:5002",onToken:S=>{}}),P=N({name:"corrector",backend:O,templateName:"phi"}),r=W({name:"Bob",brain:E([G,P])}),M=t("div",{class:"prosed"},[t("h1",null,"Multiple experts")],-1),z={class:"flex flex-col space-y-5 mt-5"},H=t("div",null,"We can use different experts for different tasks, in sequence or parallel. An expert is basically a connection to a server that uses a specific model. ",-1),I=t("div",null,"To make the interactive examples work run two local instances of Koboldcpp with different models. We will use small models for this example so that it can work with low memory requirements: ",-1),D=t("div",{class:"prose"},[t("ul",null,[t("li",null,[t("a",{href:"https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF"},"Tinyllama Chat"),p(' (1B) as "the kid" expert')]),t("li",null,[t("a",{href:"https://huggingface.co/TheBloke/phi-2-GGUF"},"Phi 2"),p(' (3B) as "the corrector" expert that will fix the mistakes of the first model ')])])],-1),K=t("div",null,[p("Run both servers with the second one using the "),t("kbd",null,"--port 5002"),p(" option. Let's create our experts: ")],-1),X=t("div",null,"We now have two experts:",-1),Y={class:"txt-light"},Z={key:0},tt=t("div",{class:"prose"},[t("h2",null,"Query experts")],-1),et=t("div",null,"We can query the experts one by one or simultaneously:",-1),ot={class:"flex flex-row space-x-3"},st={key:0,class:"flex flex-row w-full space-x-3"},nt={class:"w-1/2 txt-light"},at={class:"w-1/2"},it=t("div",null,[p("We use the "),t("kbd",null,"thinkx"),p(" method to query a specific expert:")],-1),lt=t("div",null,"The template part:",-1),rt=t("div",{class:"prose"},[t("h2",null,"Example workflow")],-1),ct=t("div",null,"In this example we are going to create a workflow that uses our experts with these steps:",-1),ut=t("div",{class:"prose"},[t("ol",null,[t("li",null,"The kid expert will be asked to produce some json"),t("li",null,"The json validity of the output is checked"),t("li",null,"If the output is not valid json, attempt to fix it with the corrector expert")])],-1),dt={class:"flex flex-row space-x-3"},pt={key:1,class:"flex flex-row w-full space-x-3"},ht={class:"w-1/3 txt-light"},mt={class:"w-2/3 flex flex-col"},vt={class:"mt-3"},xt=t("div",null,"Let's start by creating some functions to validate and fix json:",-1),ft=t("div",null,"Now the fix json with retries part and the state management:",-1),bt=t("div",null,"And finally the function to run all steps:",-1),kt=t("div",{class:"pt-5"},[t("a",{href:"javascript:openLink('/the_brain/templates/basics')"},"Next: templates: basics")],-1),_t=`import { Lm } from "@locallm/api";
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

export { bob }`,wt=`<div v-for="(expert, i) in bob.brain.experts" class="txt-light">
    {{ i + 1 }}. {{ expert.name }} <span v-if="expert.name == bob.brain.ex.name">(default)</span>
</div>`,gt=`const q1 = ref("Which planet has the most moons? Return the planet name only");

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
    await bob.brain.thinkx(expertName,
        q1.value, // the prompt from the textarea
        {
            temperature: 0,
            min_p: 0.05,
            max_tokens: 200,
        },
        {
            verbose: true,
        })
}`,yt=`<div>
    <Textarea class="w-[50rem] mt-3" v-model="q1" :rows="1" />
</div>
<div class="flex flex-row space-x-3">
    <button class="btn semilight" @click="runQ1('kid');">Run the
        query with the kid</button>
    <button class="btn semilight" @click="runQ1('corrector');">Run the
        query with the corrector</button>
    <button class="btn semilight" @click="runQ1('corrector'); runQ1('kid')">Run the
        query with both in paralel</button>
</div>`,jt=`function validateJson(text: string): boolean {
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
    const resp = await bob.brain.thinkx("corrector",
        _prompt,
        {
            temperature: 0,
            min_p: 0.05,
            max_tokens: 500,
        })
    return resp.text
}`,qt=`import { reactive } from 'vue';

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
}`,Jt=`async function runQ2() {
    await check();
    status.result = "";
    status.operation = ""
    console.log("Step 1: query with the kid");
    const resp = await bob.brain.thinkx("kid",
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
}`,Ct=R({__name:"multiple_experts",setup(S){const v=_("q1"),g=V(r.brain.expert("kid").stream),T=V(r.brain.expert("corrector").stream),a=A({operation:"",result:""}),b=_("Which planet has the most moons? Return the planet name only"),k=_("List the 3 biggest websites in json");async function y(){return!r.brain.state.get().isOn&&!await r.brain.discover()?(console.warn("Can not run query: the inference server is down"),!1):!0}async function x(n){await y(),v.value="q1",await r.brain.thinkx(n,b.value,{temperature:0,min_p:.05,repeat_penalty:1.1,max_tokens:200},{verbose:!0})}function j(n){try{return JSON.parse(n),!0}catch{return!1}}async function B(n){console.log("Fixing invalid json");const o=`convert this to a valid json array:

\`\`\`
${n}
\`\`\``;return(await r.brain.thinkx("corrector",o,{temperature:0,min_p:.05,max_tokens:500})).text}async function q(n,o=3,s=0){if(s>o)return a.operation="Unable to validate json",{text:n,valid:!1};let i="",f=!1;if(a.operation="Checking json validity",j(n))f=!0,i=n,a.result=i,a.operation="Fixed the data to valid json:";else{a.operation=`Attempting to fix json, attempt ${s+1}`;const J=await B(n);if(j(J))i=J,a.result=i,f=!0,a.operation="Fixed the data to valid json:";else{const F=await q(n,s+1);F.valid&&(f=!0,i=F.text,a.operation="Fixed the data to valid json:",a.result=i)}}return{text:i,valid:f}}async function C(){await y(),v.value="q2",a.result="",a.operation="",console.log("Step 1: query with the kid");const n=await r.brain.thinkx("kid",k.value,{temperature:0,min_p:.05,max_tokens:500});console.log("Result:",n.text),console.log("Step 2: validating json");const{text:o,valid:s}=await q(n.text);s?console.log("Valid json:",o):console.warn("Unable to fix json:",o)}return(n,o)=>(h(),m("div",null,[M,t("div",z,[H,I,D,K,t("div",null,[l(e(u),{hljs:e(c),code:_t,lang:"ts"},null,8,["hljs"])]),X,t("div",null,[(h(!0),m(Q,null,U(e(r).brain.experts,(s,i)=>(h(),m("div",Y,[p(d(i+1)+". "+d(s.name)+" ",1),s.name==e(r).brain.ex.name?(h(),m("span",Z,"(current default)")):w("",!0)]))),256))]),t("div",null,[l(e(u),{hljs:e(c),code:wt,lang:"html"},null,8,["hljs"])]),tt,et,t("div",null,[l(e(L),{class:"w-[50rem] mt-3",modelValue:b.value,"onUpdate:modelValue":o[0]||(o[0]=s=>b.value=s),rows:1},null,8,["modelValue"])]),t("div",ot,[t("button",{class:"btn semilight",onClick:o[1]||(o[1]=s=>{x("kid")})},"Run the query with the kid"),t("button",{class:"btn semilight",onClick:o[2]||(o[2]=s=>{x("corrector")})},"Run the query with the corrector"),t("button",{class:"btn semilight",onClick:o[3]||(o[3]=s=>{x("corrector"),x("kid")})},"Run the query with both in paralel")]),v.value=="q1"?(h(),m("div",st,[t("div",nt,d(e(g)),1),t("div",at,d(e(T)),1)])):w("",!0),it,t("div",null,[l(e(u),{hljs:e(c),code:gt,lang:"ts"},null,8,["hljs"])]),lt,t("div",null,[l(e(u),{hljs:e(c),code:yt,lang:"html"},null,8,["hljs"])]),rt,ct,ut,t("div",null,[l(e(L),{class:"w-[50rem] mt-3",modelValue:k.value,"onUpdate:modelValue":o[4]||(o[4]=s=>k.value=s),rows:1,disabled:""},null,8,["modelValue"])]),t("div",dt,[t("button",{class:"btn semilight",onClick:o[5]||(o[5]=s=>{C()})},"Run the steps")]),v.value=="q2"?(h(),m("div",pt,[t("div",ht,d(e(g)),1),t("div",mt,[t("div",null,d(a.operation),1),t("div",vt,d(a.result),1)])])):w("",!0),xt,t("div",null,[l(e(u),{hljs:e(c),code:jt,lang:"ts"},null,8,["hljs"])]),ft,t("div",null,[l(e(u),{hljs:e(c),code:qt,lang:"ts"},null,8,["hljs"])]),bt,t("div",null,[l(e(u),{hljs:e(c),code:Jt,lang:"ts"},null,8,["hljs"])]),kt])]))}});export{Ct as default};
