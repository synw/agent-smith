import{s as S}from"./textarea.esm-Bh0_RZgs.js";import{f as B,w as R,g as T,d as A,r as _,x as V,p as Q,o as h,c as m,a as e,e as l,u as t,H as c,M as u,F as U,y as $,t as d,h as w,i as p}from"./index-oQ1hFXLf.js";const W=B({name:"kid",localLm:"koboldcpp",templateName:"zephyr"}),E={name:"Corrector",providerType:"koboldcpp",serverUrl:"http://localhost:5002",enabled:!1,apiKey:""},G=B({name:"corrector",backend:E,templateName:"phi"}),r=R({name:"Bob",brain:T([W,G])}),O=e("div",{class:"prosed"},[e("h1",null,"Multiple experts")],-1),P={class:"flex flex-col space-y-5 mt-5"},K=e("div",null,"We can use different experts for different tasks, in sequence or parallel. An expert is basically a connection to a server that uses a specific model. ",-1),M=e("div",null,"To make the interactive examples work run two local instances of Koboldcpp with different models. We will use small models for this example so that it can work with low memory requirements: ",-1),z=e("div",{class:"prose"},[e("ul",null,[e("li",null,[e("a",{href:"https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF"},"Tinyllama Chat"),p(' (1B) as "the kid" expert')]),e("li",null,[e("a",{href:"https://huggingface.co/TheBloke/phi-2-GGUF"},"Phi 2"),p(' (3B) as "the corrector" expert that will fix the mistakes of the first model ')])])],-1),H=e("div",null,[p("Run both servers with the second one using the "),e("kbd",null,"--port 5002"),p(" option. Let's create our experts: ")],-1),I=e("div",null,"We now have two experts:",-1),D={class:"txt-light"},X={key:0},Y=e("div",{class:"prose"},[e("h2",null,"Query experts")],-1),Z=e("div",null,"We can query the experts one by one or simultaneously:",-1),ee={class:"flex flex-row space-x-3"},te={key:0,class:"flex flex-row w-full space-x-3"},se={class:"w-1/2 txt-light"},oe={class:"w-1/2"},ne=e("div",null,[p("We use the "),e("kbd",null,"thinkx"),p(" method to query a specific expert:")],-1),ae=e("div",null,"The template part:",-1),ie=e("div",{class:"prose"},[e("h2",null,"Example workflow")],-1),le=e("div",null,"In this example we are going to create a workflow that uses our experts with these steps:",-1),re=e("div",{class:"prose"},[e("ol",null,[e("li",null,"The kid expert will be asked to produce some json"),e("li",null,"The json validity of the output is checked"),e("li",null,"If the output is not valid json, attempt to fix it with the corrector expert")])],-1),ce={class:"flex flex-row space-x-3"},ue={key:1,class:"flex flex-row w-full space-x-3"},de={class:"w-1/3 txt-light"},pe={class:"w-2/3 flex flex-col"},he={class:"mt-3"},me=e("div",null,"Let's start by creating some functions to validate and fix json:",-1),xe=e("div",null,"Now the fix json with retries part and the state management:",-1),ve=e("div",null,"And finally the function to run all steps:",-1),fe=e("div",{class:"pt-5"},[e("a",{href:"javascript:openLink('/the_brain/templates/basics')"},"Next: templates: basics")],-1),be=`import { useAgentSmith } from "@agent-smith/body";
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

export { bob }`,ke=`<div v-for="(expert, i) in bob.brain.experts" class="txt-light">
    {{ i + 1 }}. {{ expert.name }} <span v-if="expert.name == bob.brain.ex.name">(default)</span>
</div>`,_e=`const q1 = ref("Which planet has the most moons? Return the planet name only");

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
}`,we=`<div>
    <Textarea class="w-[50rem] mt-3" v-model="q1" :rows="1" />
</div>
<div class="flex flex-row space-x-3">
    <button class="btn semilight" @click="runQ1('kid');">Run the
        query with the kid</button>
    <button class="btn semilight" @click="runQ1('corrector');">Run the
        query with the corrector</button>
    <button class="btn semilight" @click="runQ1('corrector'); runQ1('kid')">Run the
        query with both in paralel</button>
</div>`,ge=`function validateJson(text: string): boolean {
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
}`,ye=`import { reactive } from 'vue';

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
}`,je=`async function runQ2() {
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
}`,Ve=A({__name:"multiple_experts",setup(qe){const x=_("q1"),g=V(r.brain.expert("kid").stream),C=V(r.brain.expert("corrector").stream),a=Q({operation:"",result:""}),b=_("Which planet has the most moons? Return the planet name only"),k=_("List the 3 biggest websites in json");async function y(){return!r.brain.state.get().isOn&&!await r.brain.discover()?(console.warn("Can not run query: the inference server is down"),!1):!0}async function v(n){await y(),x.value="q1",await r.brain.thinkx(n,b.value,{temperature:0,min_p:.05,repeat_penalty:1.1,max_tokens:200},{verbose:!0})}function j(n){try{return JSON.parse(n),!0}catch{return!1}}async function L(n){console.log("Fixing invalid json");const s=`convert this to a valid json array:

\`\`\`
${n}
\`\`\``;return(await r.brain.thinkx("corrector",s,{temperature:0,min_p:.05,max_tokens:500})).text}async function q(n,s=3,o=0){if(o>s)return a.operation="Unable to validate json",{text:n,valid:!1};let i="",f=!1;if(a.operation="Checking json validity",j(n))f=!0,i=n,a.result=i,a.operation="Fixed the data to valid json:";else{a.operation=`Attempting to fix json, attempt ${o+1}`;const J=await L(n);if(j(J))i=J,a.result=i,f=!0,a.operation="Fixed the data to valid json:";else{const F=await q(n,o+1);F.valid&&(f=!0,i=F.text,a.operation="Fixed the data to valid json:",a.result=i)}}return{text:i,valid:f}}async function N(){await y(),x.value="q2",a.result="",a.operation="",console.log("Step 1: query with the kid");const n=await r.brain.thinkx("kid",k.value,{temperature:0,min_p:.05,max_tokens:500});console.log("Result:",n.text),console.log("Step 2: validating json");const{text:s,valid:o}=await q(n.text);o?console.log("Valid json:",s):console.warn("Unable to fix json:",s)}return(n,s)=>(h(),m("div",null,[O,e("div",P,[K,M,z,H,e("div",null,[l(t(u),{hljs:t(c),code:be,lang:"ts"},null,8,["hljs"])]),I,e("div",null,[(h(!0),m(U,null,$(t(r).brain.experts,(o,i)=>(h(),m("div",D,[p(d(i+1)+". "+d(o.name)+" ",1),o.name==t(r).brain.ex.name?(h(),m("span",X,"(current default)")):w("",!0)]))),256))]),e("div",null,[l(t(u),{hljs:t(c),code:ke,lang:"html"},null,8,["hljs"])]),Y,Z,e("div",null,[l(t(S),{class:"w-[50rem] mt-3",modelValue:b.value,"onUpdate:modelValue":s[0]||(s[0]=o=>b.value=o),rows:1},null,8,["modelValue"])]),e("div",ee,[e("button",{class:"btn semilight",onClick:s[1]||(s[1]=o=>{v("kid")})},"Run the query with the kid"),e("button",{class:"btn semilight",onClick:s[2]||(s[2]=o=>{v("corrector")})},"Run the query with the corrector"),e("button",{class:"btn semilight",onClick:s[3]||(s[3]=o=>{v("corrector"),v("kid")})},"Run the query with both in paralel")]),x.value=="q1"?(h(),m("div",te,[e("div",se,d(t(g)),1),e("div",oe,d(t(C)),1)])):w("",!0),ne,e("div",null,[l(t(u),{hljs:t(c),code:_e,lang:"ts"},null,8,["hljs"])]),ae,e("div",null,[l(t(u),{hljs:t(c),code:we,lang:"html"},null,8,["hljs"])]),ie,le,re,e("div",null,[l(t(S),{class:"w-[50rem] mt-3",modelValue:k.value,"onUpdate:modelValue":s[4]||(s[4]=o=>k.value=o),rows:1,disabled:""},null,8,["modelValue"])]),e("div",ce,[e("button",{class:"btn semilight",onClick:s[5]||(s[5]=o=>{N()})},"Run the steps")]),x.value=="q2"?(h(),m("div",ue,[e("div",de,d(t(g)),1),e("div",pe,[e("div",null,d(a.operation),1),e("div",he,d(a.result),1)])])):w("",!0),me,e("div",null,[l(t(u),{hljs:t(c),code:ge,lang:"ts"},null,8,["hljs"])]),xe,e("div",null,[l(t(u),{hljs:t(c),code:ye,lang:"ts"},null,8,["hljs"])]),ve,e("div",null,[l(t(u),{hljs:t(c),code:je,lang:"ts"},null,8,["hljs"])]),fe])]))}});export{Ve as default};
