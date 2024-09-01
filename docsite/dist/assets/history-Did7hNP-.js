import{d as c,b as p,o as u,c as d,a as t,e,u as s,H as o,M as a,t as h}from"./index-DR--IRxr.js";import{e as r}from"./agent4-CeBaewLh.js";const m=t("div",{class:"prosed"},[t("h1",null,"History management")],-1),_={class:"flex flex-col space-y-5 mt-5"},f=t("div",null,"The history of a conversation can be handled in templates. Let's create an expert with an Alpaca template:",-1),x=t("div",null,"Let's add some history turns:",-1),y={class:"txt-light"},v=t("div",{class:"prose"},[t("h2",null,"Usage")],-1),H=t("div",null,"To record the history turns use this:",-1),g=t("div",{class:"pt-5"},[t("a",{href:"javascript:openLink('/the_brain/templates/few_shots')"},"Next: few shots")],-1),T=`import { useLmExpert } from "@agent-smith/brain";

const expert = useLmExpert({
    name: "default",
    localLm: "koboldcpp",
    templateName: "alpaca",
});

export { expert }`,j=`import { HistoryTurn } from "modprompt";

const turns: Array<HistoryTurn> = [
    {
        user: "Hello",
        assistant: "Hi, what can I do for you?"
    },
    {
        user: "What is your name",
        assistant: "I am AI assistant xyz"
    },
];
turns.forEach((t) => expert.template.pushToHistory(t));
const finalTemplate = expert.template.render();`,w=`const _prompt = "What is your name?"
const res = await expert.think(_prompt);
expert.pushToHistory({user: _prompt, assistant: res.text});`,k=c({__name:"history",setup(I){function l(){[{user:"Hello",assistant:"Hi, what can I do for you?"},{user:"What is your name",assistant:"I am AI assistant xyz"}].forEach(n=>r.template.pushToHistory(n))}return p(()=>{l()}),(i,n)=>(u(),d("div",null,[m,t("div",_,[f,t("div",null,[e(s(a),{hljs:s(o),code:T,lang:"ts"},null,8,["hljs"])]),x,t("div",y,[t("pre",null,h(s(r).template.render()),1)]),t("div",null,[e(s(a),{hljs:s(o),code:j,lang:"ts"},null,8,["hljs"])]),v,H,t("div",null,[e(s(a),{hljs:s(o),code:w,lang:"ts"},null,8,["hljs"])]),g])]))}});export{k as default};
