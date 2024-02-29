import{s as d}from"./textarea.esm-Bm0AQBLZ.js";import{d as u,r as p,b as h,o as g,c as f,a as e,e as a,u as t,H as r,M as o,g as s,t as _}from"./index-BRk7anpM.js";import{a as b,b as v,c as m}from"./agent-g-a1HYAK.js";import{discover as y}from"./utils-DZ37F4NF.js";import{_ as k}from"./AgentJoeV3.vue_vue_type_style_index_0_lang-ZpFNV89y.js";import"./lm-mqbLQnkx.js";import"./index-iXfWNpia.js";import"./RobotIcon-BcM7qFfK.js";import"./_plugin-vue_export-helper-DlAUqK2U.js";const w=e("div",{class:"prosed"},[e("h1",null,"Gbnf grammars")],-1),j={class:"flex flex-col space-y-5 mt-5"},x=e("div",null,[s("An expert can use gbnf grammars to constraint the output of the language model to a given format. The grammars can be defined in Typescript intefaces with "),e("a",{href:"https://github.com/IntrinsicLabsAI/gbnfgen"},"Gbnfgen"),s(" or as raw strings. ")],-1),A=e("div",{class:"prosed"},[e("h2",null,"Typescript grammars")],-1),G=e("br",null,null,-1),T={class:"font-light"},V=e("div",null,"The button click is mapped on this code:",-1),B=e("div",{class:"prosed"},[e("h2",null,"Raw grammars")],-1),N=e("div",null,"Another option is to pass directly a gbnf grammar string in the options parameter. A simple yes/no grammar: ",-1),q=e("div",null,[s("Use the "),e("kbd",null,"grammar"),s(" option:")],-1),C=e("div",null,[s("Note about json: by default if a "),e("kbd",null,"grammar"),s(" or "),e("kbd",null,"tsgrammar"),s(" is provided the answer will be formated in json. Use the "),e("kbd",null,"parseJson"),s(" option to change this behavior. ")],-1),J=e("div",{class:"pt-5"},[e("a",{href:"javascript:openLink('/the_brain/multiple_experts')"},"Next: multiple experts")],-1),M=`interface Grammar {
    planet_names: Array<string>;
}`,Q="const tsgrammar = `interface Grammar {\n    planet_names: Array<string>;\n}`",S=`async function runQ1() {
    if (!brain.state.get().isOn) {
        const found = await brain.discover();
        if (!found) {
            console.warn("Can not run query: the inference server is down")
            return
        }
    }
    await brain.think(q1.value, // the prompt
        {
            temperature: 0,
            min_p: 0.05,
            max_tokens: 500,
        },
        {
            tsGrammar: tsgrammar,
            verbose: true,
        })
}`,U='const grammar = "root ::= (\\"yes\\" | \\"no\\")"',H=`await brain.think("is the sky blue?"
    { temperature: 0 },
    { 
        grammar: grammar, 
        parseJson: false 
    },
)`,P=u({__name:"grammars",setup(I){const i=p("Write a list of the planets names of the solar system");async function c(){m.state.get().isOn||await y(),await m.think(i.value,{temperature:0,min_p:.05,max_tokens:500},{tsGrammar:M,verbose:!0})}return h(()=>b.state.setKey("component","AgentBaseText")),(L,n)=>(g(),f("div",null,[w,e("div",j,[x,A,e("div",null,[a(t(o),{hljs:t(r),code:Q,lang:"ts"},null,8,["hljs"])]),e("div",null,[s(" Query:"),G,a(t(d),{class:"w-[50rem] mt-3",modelValue:i.value,"onUpdate:modelValue":n[0]||(n[0]=l=>i.value=l),rows:1,disabled:""},null,8,["modelValue"])]),e("div",null,[e("button",{class:"btn semilight",onClick:n[1]||(n[1]=l=>c())},"Run the query")]),e("pre",T,[e("code",null,_(t(v)),1)]),V,e("div",null,[a(t(o),{hljs:t(r),code:S,lang:"ts"},null,8,["hljs"])]),B,N,e("div",null,[a(t(o),{hljs:t(r),code:U,lang:"ts"},null,8,["hljs"])]),q,e("div",null,[a(t(o),{hljs:t(r),code:H,lang:"ts"},null,8,["hljs"])]),C,J,a(k)])]))}});export{P as default};
