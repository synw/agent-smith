import{d as k,p as v,q as c,e as p,c as g,o as f,a as t,g as n,f as s,H as l,M as o,t as u}from"./index-ruRH7gpx.js";const h={class:"flex flex-col space-y-5 mt-5"},w={class:"flex flex-col space-y-2"},j=`import { useTmem } from "@agent-smith/tmem";

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

const tmem = useTmem<MyPersistentState>("mystate", initialData);`,M=`import { onBeforeMount, reactive } from "vue";

// ...

const state = reactive<MyPersistentState>(initialData);

async function init() {
    await tmem.init();
    state.key1 = await tmem.get("key1");
    state.key2 = await tmem.get("key2");
    state.key3 = await tmem.get("key3");
}

onBeforeMount(() => init())`,b=`<div class="flex flex-col space-y-2">
    <div>Key1: {{ state.key1 }}</div>
    <div>Key2: {{ state.key2 }}</div>
    <div>Key3: {{ state.key3 }}</div>s
</div>`,x=`async function mutateState() {
    const key2 = await tmem.get<Array<number>>("key2");
    key2.push(1);
    await tmem.set("key2", key2);
    state.key2 = key2;
}`,S='<button class="btn light" @click="mutateState()">Mutate</button>',N=k({__name:"usage",setup(B){const r={key1:"value1",key2:[0,1],key3:{k:"v"}},a=v("mystate",r),i=c(r);async function m(){await a.init(),i.key1=await a.get("key1"),i.key2=await a.get("key2"),i.key3=await a.get("key3")}async function d(){const y=await a.get("key2");y.push(1),await a.set("key2",y),i.key2=y}return p(()=>m()),(y,e)=>(f(),g("div",null,[e[7]||(e[7]=t("div",{class:"prosed"},[t("h1",null,"Usage")],-1)),t("div",h,[e[1]||(e[1]=t("div",null,"Let's initialize a persistent state object:",-1)),t("div",null,[n(s(o),{hljs:s(l),code:j,lang:"ts"},null,8,["hljs"])]),e[2]||(e[2]=t("div",null,"Note: the interface definition is optional, it is used to get a better autocompletion in the IDE.",-1)),e[3]||(e[3]=t("div",null,"To retrieve the persistent state from memory:",-1)),t("div",null,[n(s(o),{hljs:s(l),code:M,lang:"ts"},null,8,["hljs"])]),e[4]||(e[4]=t("div",null,"Then render this in the template:",-1)),t("div",w,[t("div",null,"Key1: "+u(i.key1),1),t("div",null,"Key2: "+u(i.key2),1),t("div",null,"Key3: "+u(i.key3),1)]),t("div",null,[n(s(o),{hljs:s(l),code:b,lang:"html"},null,8,["hljs"])]),e[5]||(e[5]=t("div",null,"Now let's change some values in the state and see how it persists:",-1)),t("div",null,[n(s(o),{hljs:s(l),code:x,lang:"ts"},null,8,["hljs"])]),t("div",null,[t("button",{class:"btn light",onClick:e[0]||(e[0]=D=>d())},"Mutate")]),t("div",null,[n(s(o),{hljs:s(l),code:S,lang:"html"},null,8,["hljs"])]),e[6]||(e[6]=t("div",null,"Reload the page to see that the state changes will persist.",-1))]),e[8]||(e[8]=t("div",{class:"pt-8"},[t("a",{href:"javascript:openLink('/transient_memory/api')"},"Next: api")],-1))]))}});export{N as default};
