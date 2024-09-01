import{d as r,m as k,p as h,b as v,o as p,c as g,a as t,e as i,u as e,H as n,M as l,t as c}from"./index-DR--IRxr.js";const _=t("div",{class:"prosed"},[t("h1",null,"Usage")],-1),f={class:"flex flex-col space-y-5 mt-5"},w=t("div",null,"Let's initialize a persistent state object:",-1),j=t("div",null,"Note: the interface definition is optional, it is used to get a better autocompletion in the IDE.",-1),M=t("div",null,"To retrieve the persistent state from memory:",-1),b=t("div",null,"Then render this in the template:",-1),x={class:"flex flex-col space-y-2"},S=t("div",null,"Now let's change some values in the state and see how it persists:",-1),B=t("div",null,"Reload the page to see that the state changes will persist.",-1),D=t("div",{class:"pt-8"},[t("a",{href:"javascript:openLink('/transient_memory/api')"},"Next: api")],-1),K=`import { useTmem } from "@agent-smith/tmem";

interface MyPersistentState {
    key1: string;
    key2: Array<number>;
    key3: Record<string, any>;
}

const initialData: MyPersistentState = {
    key1: "value1",
    key2: [0, 1],
    key3: { "k": "v" },
}

const tmem = useTmem<MyPersistentState>("mystate", initialData);`,N=`import { onBeforeMount, reactive } from "vue";

// ...

const state = reactive<MyPersistentState>(initialData);

async function init() {
    await tmem.init();
    state.key1 = await tmem.get("key1");
    state.key2 = await tmem.get("key2");
    state.key3 = await tmem.get("key3");
}

onBeforeMount(() => init())`,T=`<div class="flex flex-col space-y-2">
    <div>Key1: {{ state.key1 }}</div>
    <div>Key2: {{ state.key2 }}</div>
    <div>Key3: {{ state.key3 }}</div>s
</div>`,P=`async function mutateState() {
    const key2 = await tmem.get<Array<number>>("key2");
    key2.push(1);
    await tmem.set("key2", key2);
    state.key2 = key2;
}`,A='<button class="btn light" @click="mutateState()">Mutate</button>',L=r({__name:"usage",setup(C){const y={key1:"value1",key2:[0,1],key3:{k:"v"}},a=k("mystate",y),s=h(y);async function u(){await a.init(),s.key1=await a.get("key1"),s.key2=await a.get("key2"),s.key3=await a.get("key3")}async function m(){const o=await a.get("key2");o.push(1),await a.set("key2",o),s.key2=o}return v(()=>u()),(o,d)=>(p(),g("div",null,[_,t("div",f,[w,t("div",null,[i(e(l),{hljs:e(n),code:K,lang:"ts"},null,8,["hljs"])]),j,M,t("div",null,[i(e(l),{hljs:e(n),code:N,lang:"ts"},null,8,["hljs"])]),b,t("div",x,[t("div",null,"Key1: "+c(s.key1),1),t("div",null,"Key2: "+c(s.key2),1),t("div",null,"Key3: "+c(s.key3),1)]),t("div",null,[i(e(l),{hljs:e(n),code:T,lang:"html"},null,8,["hljs"])]),S,t("div",null,[i(e(l),{hljs:e(n),code:P,lang:"ts"},null,8,["hljs"])]),t("div",null,[t("button",{class:"btn light",onClick:d[0]||(d[0]=E=>m())},"Mutate")]),t("div",null,[i(e(l),{hljs:e(n),code:A,lang:"html"},null,8,["hljs"])]),B]),D]))}});export{L as default};
