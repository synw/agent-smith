import{s as u}from"./textarea.esm-D2yOeTtn.js";import{d as p,r as h,o as g,c as f,a as e,e as n,u as t,H as r,M as o,g as s,t as _}from"./index-CboZIT6v.js";import{b,c as l}from"./agent-BFtiMqbc.js";import"./lm-BizhkHiD.js";import"./index-BZxdWYOY.js";const v=e("div",{class:"prosed"},[e("h1",null,"Gbnf grammars")],-1),y={class:"flex flex-col space-y-5 mt-5"},w=e("div",null,[s("An expert can use gbnf grammars to constraint the output of the language model to a given format. The grammars can be defined in Typescript intefaces with "),e("a",{href:"https://github.com/IntrinsicLabsAI/gbnfgen"},"Gbnfgen"),s(" or as raw strings. ")],-1),k=e("div",{class:"prosed"},[e("h2",null,"Typescript grammars")],-1),j=e("br",null,null,-1),x={class:"font-light"},A=e("div",null,"The button click is mapped on this code:",-1),G=e("div",{class:"prosed"},[e("h2",null,"Raw grammars")],-1),V=e("div",null,"Another option is to pass directly a gbnf grammar string in the options parameter. A simple yes/no grammar: ",-1),q=e("div",null,[s("Use the "),e("kbd",null,"grammar"),s(" option:")],-1),N=e("div",null,[s("Note about json: by default if a "),e("kbd",null,"grammar"),s(" or "),e("kbd",null,"tsgrammar"),s(" is provided the answer will be formated in json. Use the "),e("kbd",null,"parseJson"),s(" option to change this behavior. ")],-1),T=e("div",{class:"pt-5"},[e("a",{href:"javascript:openLink('/the_brain/multiple_experts')"},"Next: multiple experts")],-1),C=`interface Grammar {
    planet_names: Array<string>;
}`,B="const tsgrammar = `interface Grammar {\n    planet_names: Array<string>;\n}`",J=`async function runQ1() {
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
}`,Q='const grammar = "root ::= (\\"yes\\" | \\"no\\")"',S=`await brain.think("is the sky blue?"
    { temperature: 0 },
    { 
        grammar: grammar, 
        parseJson: false 
    },
)`,R=p({__name:"grammars",setup(U){const i=h("Write a list of the planets names of the solar system");async function d(){if(!l.state.get().isOn&&!await l.discover()){console.warn("Can not run query: the inference server is down");return}await l.think(i.value,{temperature:0,min_p:.05,max_tokens:500},{tsGrammar:C,verbose:!0})}return(c,a)=>(g(),f("div",null,[v,e("div",y,[w,k,e("div",null,[n(t(o),{hljs:t(r),code:B,lang:"ts"},null,8,["hljs"])]),e("div",null,[s(" Query:"),j,n(t(u),{class:"w-[50rem] mt-3",modelValue:i.value,"onUpdate:modelValue":a[0]||(a[0]=m=>i.value=m),rows:1,disabled:""},null,8,["modelValue"])]),e("div",null,[e("button",{class:"btn semilight",onClick:a[1]||(a[1]=m=>d())},"Run the query")]),e("pre",x,[e("code",null,_(t(b)),1)]),A,e("div",null,[n(t(o),{hljs:t(r),code:J,lang:"ts"},null,8,["hljs"])]),G,V,e("div",null,[n(t(o),{hljs:t(r),code:Q,lang:"ts"},null,8,["hljs"])]),q,e("div",null,[n(t(o),{hljs:t(r),code:S,lang:"ts"},null,8,["hljs"])]),N,T])]))}});export{R as default};
