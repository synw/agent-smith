import{d as n,b as i,o as l,c as h,a as e,e as u,u as s,H as d,M as p,t as m}from"./index-BMtjbDYc.js";import{e as a}from"./agent4-Dgco1ril.js";const c={class:"flex flex-col space-y-5 mt-5"},f={class:"txt-light"},v=`import { TurnBlock } from "modprompt";

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
shots.forEach((s) => expert.template.addShot(s.user, s.assistant));`,T=n({__name:"few_shots",setup(g){function o(){[{user:"The movie was incredibly entertaining and I laughed a lot",assistant:"positive"},{user:"The service at the restaurant was unbearably slow",assistant:"negative"},{user:"The weather today is neither hot nor cold, it's just right",assistant:"neutral"}].forEach(t=>a.template.addShot(t.user,t.assistant))}return i(()=>o()),(r,t)=>(l(),h("div",null,[t[3]||(t[3]=e("div",{class:"prosed"},[e("h1",null,"Few shots prompts")],-1)),e("div",c,[t[0]||(t[0]=e("div",null,"Adding a few shots to the prompt often helps to improve the quality of the output. It works the same as history, except that shots come first. ",-1)),t[1]||(t[1]=e("div",null,"Let's create a few shot prompt (using the Alpaca template):",-1)),e("div",null,[u(s(p),{hljs:s(d),code:v,lang:"ts"},null,8,["hljs"])]),t[2]||(t[2]=e("div",null,"The template rendering:",-1)),e("div",f,[e("pre",null,m(s(a).template.render()),1)])])]))}});export{T as default};
