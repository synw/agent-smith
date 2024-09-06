import{s as h}from"./textarea.esm-CyVB3fZ-.js";import{d as y,x as p,z as r,r as g,b as k,o as f,c as v,a as t,h as n,e as a,u as s,H as o,M as l,t as w,i as x,k as j,A}from"./index-BMtjbDYc.js";import{discover as V}from"./utils-DVdBhLDK.js";import{_ as G}from"./AgentV3.vue_vue_type_style_index_0_lang-Cy0RpR9d.js";import"./RobotIcon-BjdlsRE6.js";const N={class:"flex flex-col space-y-5 mt-5"},T={key:0,class:"font-light"},B=`interface Grammar {
    planet_names: Array<string>;
}`,q="const tsgrammar = `interface Grammar {\n    planet_names: Array<string>;\n}`",C=`async function runQ1() {
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
}`,S='const grammar = "root ::= (\\"yes\\" | \\"no\\")"',J=`await brain.think("is the sky blue?"
    { temperature: 0 },
    { 
        grammar: grammar, 
        parseJson: false 
    },
)`,I=y({__name:"grammars",setup(L){let m=p(r.stream);const u=g(!1),i=g("Write a list of the planets names of the solar system");async function b(){j.state.setKey("component","AgentBaseText"),r.state.get().isOn||await A(),m=p(r.ex.stream),u.value=!0}async function c(){r.state.get().isOn||await V(),await r.think(i.value,{temperature:0,min_p:.05,max_tokens:500},{tsGrammar:B,verbose:!0})}return k(()=>b()),(M,e)=>(f(),v("div",null,[e[12]||(e[12]=t("div",{class:"prosed"},[t("h1",null,"Gbnf grammars")],-1)),t("div",N,[e[4]||(e[4]=t("div",null,[n("An expert can use gbnf grammars to constraint the output of the language model to a given format. The grammars can be defined in Typescript intefaces with "),t("a",{href:"https://github.com/IntrinsicLabsAI/gbnfgen"},"Gbnfgen"),n(" or as raw strings. ")],-1)),e[5]||(e[5]=t("div",{class:"prosed"},[t("h2",null,"Typescript grammars")],-1)),t("div",null,[a(s(l),{hljs:s(o),code:q,lang:"ts"},null,8,["hljs"])]),t("div",null,[e[2]||(e[2]=n(" Query:")),e[3]||(e[3]=t("br",null,null,-1)),a(s(h),{class:"w-[50rem] mt-3",modelValue:i.value,"onUpdate:modelValue":e[0]||(e[0]=d=>i.value=d),rows:1,disabled:""},null,8,["modelValue"])]),t("div",null,[t("button",{class:"btn semilight",onClick:e[1]||(e[1]=d=>c())},"Run the query")]),u.value?(f(),v("pre",T,[t("code",null,w(s(m)),1)])):x("",!0),e[6]||(e[6]=t("div",null,"The button click is mapped on this code:",-1)),t("div",null,[a(s(l),{hljs:s(o),code:C,lang:"ts"},null,8,["hljs"])]),e[7]||(e[7]=t("div",{class:"prosed"},[t("h2",null,"Raw grammars")],-1)),e[8]||(e[8]=t("div",null,"Another option is to pass directly a gbnf grammar string in the options parameter. A simple yes/no grammar: ",-1)),t("div",null,[a(s(l),{hljs:s(o),code:S,lang:"ts"},null,8,["hljs"])]),e[9]||(e[9]=t("div",null,[n("Use the "),t("kbd",null,"grammar"),n(" option:")],-1)),t("div",null,[a(s(l),{hljs:s(o),code:J,lang:"ts"},null,8,["hljs"])]),e[10]||(e[10]=t("div",null,[n("Note about json: by default if a "),t("kbd",null,"grammar"),n(" or "),t("kbd",null,"tsgrammar"),n(" is provided the answer will be formated in json. Use the "),t("kbd",null,"parseJson"),n(" option to change this behavior. ")],-1)),e[11]||(e[11]=t("div",{class:"pt-5"},[t("a",{href:"javascript:openLink('/the_brain/multiple_experts')"},"Next: multiple experts")],-1)),a(G)])]))}});export{I as default};
