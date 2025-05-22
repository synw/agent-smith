import{d as n,u as i,b as l,e as d,c as u,o as h,a as e,g as p,f as s,H as m,M as c,t as f}from"./index-BPJ47-82.js";const v={class:"flex flex-col space-y-5 mt-5"},g={class:"txt-light"},w=`import { TurnBlock } from "modprompt";

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
shots.forEach((s) => ex.template.addShot(s.user, s.assistant));
console.log(ex.template.render());`,y=n({__name:"few_shots",setup(b){const a=i({name:"demo",backend:l({name:"browser",localLm:"browser"}),template:"chatml",model:{name:"dummy",ctx:2048}});function o(){[{user:"The movie was incredibly entertaining and I laughed a lot",assistant:"positive"},{user:"The service at the restaurant was unbearably slow",assistant:"negative"},{user:"The weather today is neither hot nor cold, it's just right",assistant:"neutral"}].forEach(t=>a.template.addShot(t.user,t.assistant))}return d(()=>o()),(r,t)=>(h(),u("div",null,[t[3]||(t[3]=e("div",{class:"prosed"},[e("h1",null,"Few shots prompts")],-1)),e("div",v,[t[0]||(t[0]=e("div",null,"Adding a few shots to the prompt often helps to improve the quality of the output. It works the same as history, except that shots come first. ",-1)),t[1]||(t[1]=e("div",null,"Let's create a few shot prompt (using the Alpaca template):",-1)),e("div",null,[p(s(c),{hljs:s(m),code:w,lang:"ts"},null,8,["hljs"])]),t[2]||(t[2]=e("div",null,"The template rendering:",-1)),e("div",g,[e("pre",null,f(s(a).template.render()),1)])]),t[4]||(t[4]=e("div",{class:"pt-5"},[e("a",{href:"javascript:openLink('/the_brain/browser')"},"Next: browser")],-1))]))}});export{y as default};
