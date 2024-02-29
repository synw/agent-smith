import{d as c,b as u,o as p,c as m,a as t,e as s,u as e,H as o,M as a,t as d}from"./index-BRk7anpM.js";import{j as r}from"./agent4-DI-4r85N.js";import"./lm-mqbLQnkx.js";const h=t("div",{class:"prosed"},[t("h1",null,"History management")],-1),_={class:"flex flex-col space-y-5 mt-5"},f=t("div",null,"The history of a conversation can be handled in templates. Let's create an expert with an Alpaca template:",-1),y=t("div",null,"Let's add some history turns:",-1),x={class:"txt-light"},g=t("div",{class:"prose"},[t("h2",null,"Usage")],-1),j=t("div",null,"To record the history turns use this:",-1),v=t("div",{class:"pt-5"},[t("a",{href:"javascript:openLink('/the_brain/templates/few_shots')"},"Next: few shots")],-1),H=`import { useAgentSmith } from "@agent-smith/body";
import { useLmExpert, useAgentBrain } from "@agent-smith/brain";

const expert = useLmExpert({
    name: "default",
    localLm: "koboldcpp",
    templateName: "alpaca",
});
const joe = useAgentSmith({
    name: "Joe",
    modules: [useAgentBrain([expert])],
});

export { joe }`,b=`import { HistoryTurn } from "modprompt";

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
turns.forEach((t) => joe.brain.ex.template.pushToHistory(t));
const finalTemplate = joe.brain.ex.template.render();`,T=`const _prompt = "What is your name?"
const res = await joe.think(_prompt);
joe.ex.template.pushToHistory({user: _prompt, assistant: res.text});`,L=c({__name:"history",setup(A){function i(){[{user:"Hello",assistant:"Hi, what can I do for you?"},{user:"What is your name",assistant:"I am AI assistant xyz"}].forEach(n=>r.brain.ex.template.pushToHistory(n))}return u(()=>{i()}),(l,n)=>(p(),m("div",null,[h,t("div",_,[f,t("div",null,[s(e(a),{hljs:e(o),code:H,lang:"ts"},null,8,["hljs"])]),y,t("div",x,[t("pre",null,d(e(r).brain.ex.template.render()),1)]),t("div",null,[s(e(a),{hljs:e(o),code:b,lang:"ts"},null,8,["hljs"])]),g,j,t("div",null,[s(e(a),{hljs:e(o),code:T,lang:"ts"},null,8,["hljs"])]),v])]))}});export{L as default};
