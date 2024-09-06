import{d as p,b as u,o as m,c as d,a as t,e as o,u as e,H as a,M as r,t as h}from"./index-BMtjbDYc.js";import{e as n}from"./agent4-Dgco1ril.js";const c={class:"flex flex-col space-y-5 mt-5"},f={class:"txt-light"},x=`import { useLmExpert } from "@agent-smith/brain";

const expert = useLmExpert({
    name: "default",
    localLm: "koboldcpp",
    templateName: "alpaca",
});

export { expert }`,y=`import { HistoryTurn } from "modprompt";

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
const finalTemplate = expert.template.render();`,v=`const _prompt = "What is your name?"
const res = await expert.think(_prompt);
expert.pushToHistory({user: _prompt, assistant: res.text});`,j=p({__name:"history",setup(H){function l(){[{user:"Hello",assistant:"Hi, what can I do for you?"},{user:"What is your name",assistant:"I am AI assistant xyz"}].forEach(s=>n.template.pushToHistory(s))}return u(()=>{l()}),(i,s)=>(m(),d("div",null,[s[5]||(s[5]=t("div",{class:"prosed"},[t("h1",null,"History management")],-1)),t("div",c,[s[0]||(s[0]=t("div",null,"The history of a conversation can be handled in templates. Let's create an expert with an Alpaca template:",-1)),t("div",null,[o(e(r),{hljs:e(a),code:x,lang:"ts"},null,8,["hljs"])]),s[1]||(s[1]=t("div",null,"Let's add some history turns:",-1)),t("div",f,[t("pre",null,h(e(n).template.render()),1)]),t("div",null,[o(e(r),{hljs:e(a),code:y,lang:"ts"},null,8,["hljs"])]),s[2]||(s[2]=t("div",{class:"prose"},[t("h2",null,"Usage")],-1)),s[3]||(s[3]=t("div",null,"To record the history turns use this:",-1)),t("div",null,[o(e(r),{hljs:e(a),code:v,lang:"ts"},null,8,["hljs"])]),s[4]||(s[4]=t("div",{class:"pt-5"},[t("a",{href:"javascript:openLink('/the_brain/templates/few_shots')"},"Next: few shots")],-1))])]))}});export{j as default};
