import{s as V}from"./textarea.esm-CyVB3fZ-.js";import{f as C,w as T,g as A,d as Q,r as w,x as B,p as U,o as m,c as h,a as t,h as u,e as a,u as n,H as d,M as c,F as $,y as W,t as p,i as g}from"./index-BMtjbDYc.js";const E=C({name:"kid",localLm:"koboldcpp",templateName:"zephyr"}),_={name:"Corrector",providerType:"koboldcpp",serverUrl:"http://localhost:5002",enabled:!1,apiKey:""},G=C({name:"corrector",backend:_,templateName:"phi"}),r=T({name:"Bob",brain:A([E,G])}),O={class:"flex flex-col space-y-5 mt-5"},P={class:"txt-light"},K={key:0},M={class:"flex flex-row space-x-3"},z={key:0,class:"flex flex-row w-full space-x-3"},H={class:"w-1/2 txt-light"},I={class:"w-1/2"},D={class:"flex flex-row space-x-3"},X={key:1,class:"flex flex-row w-full space-x-3"},Y={class:"w-1/3 txt-light"},Z={class:"w-2/3 flex flex-col"},tt={class:"mt-3"},et=`import { useAgentSmith } from "@agent-smith/body";
import { useLmExpert, useAgentBrain, LmBackendSpec } from "@agent-smith/brain";

// first expert
const kid = useLmExpert({
    name: "kid",
    localLm: "koboldcpp",
    templateName: "zephyr",
});
// second expert
const lm: LmBackendSpec = {
    name: "Corrector",
    providerType: "koboldcpp",
    serverUrl: "http://localhost:5002",
    enabled: false,
    apiKey: "",
};
const corrector = useLmExpert({
    name: "corrector",
    backend: lm,
    templateName: "phi",
});

const bob = useAgentSmith({
    name: "Bob",
    modules: [useAgentBrain([kid, corrector])],
});

export { bob }`,nt=`<div v-for="(expert, i) in bob.brain.experts" class="txt-light">
    {{ i + 1 }}. {{ expert.name }} <span v-if="expert.name == bob.brain.ex.name">(default)</span>
</div>`,st=`const q1 = ref("Which planet has the most moons? Return the planet name only");

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
}`,ot=`<div>
    <Textarea class="w-[50rem] mt-3" v-model="q1" :rows="1" />
</div>
<div class="flex flex-row space-x-3">
    <button class="btn semilight" @click="runQ1('kid');">Run the
        query with the kid</button>
    <button class="btn semilight" @click="runQ1('corrector');">Run the
        query with the corrector</button>
    <button class="btn semilight" @click="runQ1('corrector'); runQ1('kid')">Run the
        query with both in paralel</button>
</div>`,it=`function validateJson(text: string): boolean {
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
}`,lt=`import { reactive } from 'vue';

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
}`,at=`async function runQ2() {
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
}`,pt=Q({__name:"multiple_experts",setup(rt){const x=w("q1"),y=B(r.brain.expert("kid").stream),L=B(r.brain.expert("corrector").stream),i=U({operation:"",result:""}),b=w("Which planet has the most moons? Return the planet name only"),k=w("List the 3 biggest websites in json");async function j(){return!r.brain.state.get().isOn&&!await r.brain.discover()?(console.warn("Can not run query: the inference server is down"),!1):!0}async function v(o){await j(),x.value="q1",await r.brain.thinkx(o,b.value,{temperature:0,min_p:.05,repeat_penalty:1.1,max_tokens:200},{verbose:!0})}function q(o){try{return JSON.parse(o),!0}catch{return!1}}async function N(o){console.log("Fixing invalid json");const e=`convert this to a valid json array:

\`\`\`
${o}
\`\`\``;return(await r.brain.thinkx("corrector",e,{temperature:0,min_p:.05,max_tokens:500})).text}async function J(o,e=3,s=0){if(s>e)return i.operation="Unable to validate json",{text:o,valid:!1};let l="",f=!1;if(i.operation="Checking json validity",q(o))f=!0,l=o,i.result=l,i.operation="Fixed the data to valid json:";else{i.operation=`Attempting to fix json, attempt ${s+1}`;const F=await N(o);if(q(F))l=F,i.result=l,f=!0,i.operation="Fixed the data to valid json:";else{const S=await J(o,s+1);S.valid&&(f=!0,l=S.text,i.operation="Fixed the data to valid json:",i.result=l)}}return{text:l,valid:f}}async function R(){await j(),x.value="q2",i.result="",i.operation="",console.log("Step 1: query with the kid");const o=await r.brain.thinkx("kid",k.value,{temperature:0,min_p:.05,max_tokens:500});console.log("Result:",o.text),console.log("Step 2: validating json");const{text:e,valid:s}=await J(o.text);s?console.log("Valid json:",e):console.warn("Unable to fix json:",e)}return(o,e)=>(m(),h("div",null,[e[22]||(e[22]=t("div",{class:"prosed"},[t("h1",null,"Multiple experts")],-1)),t("div",O,[e[6]||(e[6]=t("div",null,"We can use different experts for different tasks, in sequence or parallel. An expert is basically a connection to a server that uses a specific model. ",-1)),e[7]||(e[7]=t("div",null,"To make the interactive examples work run two local instances of Koboldcpp with different models. We will use small models for this example so that it can work with low memory requirements: ",-1)),e[8]||(e[8]=t("div",{class:"prose"},[t("ul",null,[t("li",null,[t("a",{href:"https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF"},"Tinyllama Chat"),u(' (1B) as "the kid" expert')]),t("li",null,[t("a",{href:"https://huggingface.co/TheBloke/phi-2-GGUF"},"Phi 2"),u(' (3B) as "the corrector" expert that will fix the mistakes of the first model ')])])],-1)),e[9]||(e[9]=t("div",null,[u("Run both servers with the second one using the "),t("kbd",null,"--port 5002"),u(" option. Let's create our experts: ")],-1)),t("div",null,[a(n(c),{hljs:n(d),code:et,lang:"ts"},null,8,["hljs"])]),e[10]||(e[10]=t("div",null,"We now have two experts:",-1)),t("div",null,[(m(!0),h($,null,W(n(r).brain.experts,(s,l)=>(m(),h("div",P,[u(p(l+1)+". "+p(s.name)+" ",1),s.name==n(r).brain.ex.name?(m(),h("span",K,"(current default)")):g("",!0)]))),256))]),t("div",null,[a(n(c),{hljs:n(d),code:nt,lang:"html"},null,8,["hljs"])]),e[11]||(e[11]=t("div",{class:"prose"},[t("h2",null,"Query experts")],-1)),e[12]||(e[12]=t("div",null,"We can query the experts one by one or simultaneously:",-1)),t("div",null,[a(n(V),{class:"w-[50rem] mt-3",modelValue:b.value,"onUpdate:modelValue":e[0]||(e[0]=s=>b.value=s),rows:1},null,8,["modelValue"])]),t("div",M,[t("button",{class:"btn semilight",onClick:e[1]||(e[1]=s=>{v("kid")})},"Run the query with the kid"),t("button",{class:"btn semilight",onClick:e[2]||(e[2]=s=>{v("corrector")})},"Run the query with the corrector"),t("button",{class:"btn semilight",onClick:e[3]||(e[3]=s=>{v("corrector"),v("kid")})},"Run the query with both in paralel")]),x.value=="q1"?(m(),h("div",z,[t("div",H,p(n(y)),1),t("div",I,p(n(L)),1)])):g("",!0),e[13]||(e[13]=t("div",null,[u("We use the "),t("kbd",null,"thinkx"),u(" method to query a specific expert:")],-1)),t("div",null,[a(n(c),{hljs:n(d),code:st,lang:"ts"},null,8,["hljs"])]),e[14]||(e[14]=t("div",null,"The template part:",-1)),t("div",null,[a(n(c),{hljs:n(d),code:ot,lang:"html"},null,8,["hljs"])]),e[15]||(e[15]=t("div",{class:"prose"},[t("h2",null,"Example workflow")],-1)),e[16]||(e[16]=t("div",null,"In this example we are going to create a workflow that uses our experts with these steps:",-1)),e[17]||(e[17]=t("div",{class:"prose"},[t("ol",null,[t("li",null,"The kid expert will be asked to produce some json"),t("li",null,"The json validity of the output is checked"),t("li",null,"If the output is not valid json, attempt to fix it with the corrector expert")])],-1)),t("div",null,[a(n(V),{class:"w-[50rem] mt-3",modelValue:k.value,"onUpdate:modelValue":e[4]||(e[4]=s=>k.value=s),rows:1,disabled:""},null,8,["modelValue"])]),t("div",D,[t("button",{class:"btn semilight",onClick:e[5]||(e[5]=s=>{R()})},"Run the steps")]),x.value=="q2"?(m(),h("div",X,[t("div",Y,p(n(y)),1),t("div",Z,[t("div",null,p(i.operation),1),t("div",tt,p(i.result),1)])])):g("",!0),e[18]||(e[18]=t("div",null,"Let's start by creating some functions to validate and fix json:",-1)),t("div",null,[a(n(c),{hljs:n(d),code:it,lang:"ts"},null,8,["hljs"])]),e[19]||(e[19]=t("div",null,"Now the fix json with retries part and the state management:",-1)),t("div",null,[a(n(c),{hljs:n(d),code:lt,lang:"ts"},null,8,["hljs"])]),e[20]||(e[20]=t("div",null,"And finally the function to run all steps:",-1)),t("div",null,[a(n(c),{hljs:n(d),code:at,lang:"ts"},null,8,["hljs"])]),e[21]||(e[21]=t("div",{class:"pt-5"},[t("a",{href:"javascript:openLink('/the_brain/templates/basics')"},"Next: templates: basics")],-1))])]))}});export{pt as default};
