import{s as v}from"./textarea.esm-Bh0_RZgs.js";import{d as b,x as d,z as n,r as p,b as y,o as h,c as g,a as e,e as a,u as t,H as o,M as i,i as s,t as k,h as w,k as x,A as j}from"./index-oQ1hFXLf.js";import{discover as A}from"./utils-Bodq5srF.js";import{_ as V}from"./AgentV3.vue_vue_type_style_index_0_lang-D_OzMY2_.js";import"./RobotIcon-CC0bTfkr.js";const G=e("div",{class:"prosed"},[e("h1",null,"Gbnf grammars")],-1),N={class:"flex flex-col space-y-5 mt-5"},T=e("div",null,[s("An expert can use gbnf grammars to constraint the output of the language model to a given format. The grammars can be defined in Typescript intefaces with "),e("a",{href:"https://github.com/IntrinsicLabsAI/gbnfgen"},"Gbnfgen"),s(" or as raw strings. ")],-1),B=e("div",{class:"prosed"},[e("h2",null,"Typescript grammars")],-1),q=e("br",null,null,-1),C={key:0,class:"font-light"},S=e("div",null,"The button click is mapped on this code:",-1),J=e("div",{class:"prosed"},[e("h2",null,"Raw grammars")],-1),L=e("div",null,"Another option is to pass directly a gbnf grammar string in the options parameter. A simple yes/no grammar: ",-1),M=e("div",null,[s("Use the "),e("kbd",null,"grammar"),s(" option:")],-1),O=e("div",null,[s("Note about json: by default if a "),e("kbd",null,"grammar"),s(" or "),e("kbd",null,"tsgrammar"),s(" is provided the answer will be formated in json. Use the "),e("kbd",null,"parseJson"),s(" option to change this behavior. ")],-1),Q=e("div",{class:"pt-5"},[e("a",{href:"javascript:openLink('/the_brain/multiple_experts')"},"Next: multiple experts")],-1),R=`interface Grammar {
    planet_names: Array<string>;
}`,U="const tsgrammar = `interface Grammar {\n    planet_names: Array<string>;\n}`",H=`async function runQ1() {
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
}`,I='const grammar = "root ::= (\\"yes\\" | \\"no\\")"',$=`await brain.think("is the sky blue?"
    { temperature: 0 },
    { 
        grammar: grammar, 
        parseJson: false 
    },
)`,X=b({__name:"grammars",setup(z){let m=d(n.stream);const c=p(!1),l=p("Write a list of the planets names of the solar system");async function f(){x.state.setKey("component","AgentBaseText"),n.state.get().isOn||await j(),m=d(n.ex.stream),c.value=!0}async function _(){n.state.get().isOn||await A(),await n.think(l.value,{temperature:0,min_p:.05,max_tokens:500},{tsGrammar:R,verbose:!0})}return y(()=>f()),(D,r)=>(h(),g("div",null,[G,e("div",N,[T,B,e("div",null,[a(t(i),{hljs:t(o),code:U,lang:"ts"},null,8,["hljs"])]),e("div",null,[s(" Query:"),q,a(t(v),{class:"w-[50rem] mt-3",modelValue:l.value,"onUpdate:modelValue":r[0]||(r[0]=u=>l.value=u),rows:1,disabled:""},null,8,["modelValue"])]),e("div",null,[e("button",{class:"btn semilight",onClick:r[1]||(r[1]=u=>_())},"Run the query")]),c.value?(h(),g("pre",C,[e("code",null,k(t(m)),1)])):w("",!0),S,e("div",null,[a(t(i),{hljs:t(o),code:H,lang:"ts"},null,8,["hljs"])]),J,L,e("div",null,[a(t(i),{hljs:t(o),code:I,lang:"ts"},null,8,["hljs"])]),M,e("div",null,[a(t(i),{hljs:t(o),code:$,lang:"ts"},null,8,["hljs"])]),O,Q,a(V)])]))}});export{X as default};
