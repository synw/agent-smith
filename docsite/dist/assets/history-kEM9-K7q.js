import{d as u,u as d,b as m,e as p,c as h,o as y,a as s,t as c,f as e,g as o,H as n,M as a}from"./index-BkJOrgP8.js";const f={class:"flex flex-col space-y-5 mt-5"},x={class:"txt-light"},v=`import { HistoryTurn } from "modprompt";

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
turns.forEach((t) => ex.template.pushToHistory(t));
const finalTemplate = ex.template.render();`,H=`const _prompt = "What is your name?"
const res = await ex.think(_prompt);
ex.pushToHistory({user: _prompt, assistant: res.text});`,g="const history: Array<HistoryTurn> = ex.template.history;",w=u({__name:"history",setup(T){const r=d({name:"demo",backend:m({name:"browser",localLm:"browser"}),template:"chatml",model:{name:"dummy",ctx:2048}});function l(){[{user:"Hello",assistant:"Hi, what can I do for you?"},{user:"What is your name",assistant:"I am AI assistant xyz"}].forEach(t=>r.template.pushToHistory(t))}return p(()=>{l()}),(i,t)=>(y(),h("div",null,[t[5]||(t[5]=s("div",{class:"prosed"},[s("h1",null,"History management")],-1)),s("div",f,[t[0]||(t[0]=s("div",null,"Let's add some history turns:",-1)),s("div",x,[s("pre",null,c(e(r).template.render()),1)]),s("div",null,[o(e(a),{hljs:e(n),code:v,lang:"ts"},null,8,["hljs"])]),t[1]||(t[1]=s("div",{class:"prose"},[s("h2",null,"Usage")],-1)),t[2]||(t[2]=s("div",null,"To record the history turns use this:",-1)),s("div",null,[o(e(a),{hljs:e(n),code:H,lang:"ts"},null,8,["hljs"])]),t[3]||(t[3]=s("div",null,"Read the history:",-1)),s("div",null,[o(e(a),{hljs:e(n),code:g,lang:"ts"},null,8,["hljs"])]),t[4]||(t[4]=s("div",{class:"pt-5"},[s("a",{href:"javascript:openLink('/the_brain/templates/few_shots')"},"Next: few shots")],-1))])]))}});export{w as default};
