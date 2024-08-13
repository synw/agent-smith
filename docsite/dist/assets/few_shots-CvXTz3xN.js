import{d as n,b as i,o as l,c as h,a as t,e as c,u as s,H as d,M as u,t as p}from"./index-oQ1hFXLf.js";import{e as a}from"./agent4-C6tM4ULG.js";const m=t("div",{class:"prosed"},[t("h1",null,"Few shots prompts")],-1),_={class:"flex flex-col space-y-5 mt-5"},f=t("div",null,"Adding a few shots to the prompt often helps to improve the quality of the output. It works the same as history, except that shots come first. ",-1),v=t("div",null,"Let's create a few shot prompt (using the Alpaca template):",-1),g=t("div",null,"The template rendering:",-1),w={class:"txt-light"},y=`import { TurnBlock } from "modprompt";

const shots: Array<TurnBlock> = [
    {
        user: "The movie was incredibly entertaining and I laughed a lot",
        assistant: "positive",
    },
    {
        user: "The service at the restaurant was unbearably slow",
        assistant: "negative",
    },
    {
        user: "The weather today is neither hot nor cold, it's just right",
        assistant: "neutral",
    },
];
shots.forEach((s) => expert.template.addShot(s.user, s.assistant));`,B=n({__name:"few_shots",setup(T){function o(){[{user:"The movie was incredibly entertaining and I laughed a lot",assistant:"positive"},{user:"The service at the restaurant was unbearably slow",assistant:"negative"},{user:"The weather today is neither hot nor cold, it's just right",assistant:"neutral"}].forEach(e=>a.template.addShot(e.user,e.assistant))}return i(()=>o()),(r,e)=>(l(),h("div",null,[m,t("div",_,[f,v,t("div",null,[c(s(u),{hljs:s(d),code:y,lang:"ts"},null,8,["hljs"])]),g,t("div",w,[t("pre",null,p(s(a).template.render()),1)])])]))}});export{B as default};
