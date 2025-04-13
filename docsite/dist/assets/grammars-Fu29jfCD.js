import{s as j}from"./index-D5whqb9s.js";import{d as T,r as g,e as A,c as a,o as r,a as t,h as k,i as n,g as i,f as s,H as d,M as u,w as N,F as v,x as o,t as y,y as x}from"./index-ruRH7gpx.js";import{discover as V}from"./utils-emX6Z2Nv.js";const C={class:"flex flex-col space-y-5 mt-5"},G={key:0},q={class:"flex flex-row space-x-2"},B=["disabled"],S={key:2,class:"font-light"},$=`interface Grammar {
    planet_names: Array<string>;
}`,E="const tsgrammar = `interface Grammar {\n    planet_names: Array<string>;\n}`",J=`async function runQ1() {
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
}`,M='const grammar = "root ::= (\\"yes\\" | \\"no\\")"',O=`await brain.think("is the sky blue?"
    { temperature: 0 },
    { 
        grammar: grammar, 
        parseJson: false 
    },
)`,L=T({__name:"grammars",setup(R){let l,b;const p=g(!1),c=g(!1),f=g("Write a list of the planets names of the solar system");async function h(){p.value=o.experts.length>0,p.value&&(o.ex.checkStatus(),l=x(o.ex.state),b=x(o.ex.backend.stream)),c.value=!0}async function w(){o.state.get().isOn||await V(),await o.think(f.value,{temperature:0,min_p:.05,max_tokens:500},{tsGrammar:$,verbose:!0})}return A(()=>h()),(U,e)=>(r(),a("div",null,[e[13]||(e[13]=t("div",{class:"prosed"},[t("h1",null,"Gbnf grammars")],-1)),t("div",C,[e[5]||(e[5]=t("div",null,[n("An expert can use gbnf grammars to constraint the output of the language model to a given format, if the model and backend support it. Note: Ollama does not support grammars. The grammars can be defined in Typescript intefaces with "),t("a",{href:"https://github.com/IntrinsicLabsAI/gbnfgen"},"Gbnfgen"),n(" or as raw strings. ")],-1)),e[6]||(e[6]=t("div",{class:"prosed"},[t("h2",null,"Typescript grammars")],-1)),t("div",null,[i(s(u),{hljs:s(d),code:E,lang:"ts"},null,8,["hljs"])]),p.value?(r(),a(v,{key:1},[s(l).status=="ready"?(r(),a(v,{key:0},[i(s(j),{class:"w-[50rem] mt-3",modelValue:f.value,"onUpdate:modelValue":e[1]||(e[1]=m=>f.value=m),rows:1},null,8,["modelValue"]),t("div",q,[t("button",{class:"btn semilight",onClick:e[2]||(e[2]=m=>w()),disabled:s(l).isThinking},"Run the query",8,B),s(l).isThinking?(r(),a("button",{key:0,onClick:e[3]||(e[3]=m=>s(o).ex.abortThinking())},"Abort")):k("",!0)])],64)):(r(),a(v,{key:1},[n("expert not ready: "+y(s(l).status),1)],64))],64)):(r(),a("div",G,[e[4]||(e[4]=t("div",{class:"text-lg font-medium"},"Configure an expert for the interactive demo:",-1)),i(N,{class:"p-3 mt-3 border rounded-md",onEnd:e[0]||(e[0]=m=>h())})])),c.value?(r(),a("pre",S,[t("code",null,y(s(b)),1)])):k("",!0),e[7]||(e[7]=t("div",null,"The button click is mapped on this code:",-1)),t("div",null,[i(s(u),{hljs:s(d),code:J,lang:"ts"},null,8,["hljs"])]),e[8]||(e[8]=t("div",{class:"prosed"},[t("h2",null,"Raw grammars")],-1)),e[9]||(e[9]=t("div",null,"Another option is to pass directly a gbnf grammar string in the options parameter. A simple yes/no grammar: ",-1)),t("div",null,[i(s(u),{hljs:s(d),code:M,lang:"ts"},null,8,["hljs"])]),e[10]||(e[10]=t("div",null,[n("Use the "),t("kbd",null,"grammar"),n(" option:")],-1)),t("div",null,[i(s(u),{hljs:s(d),code:O,lang:"ts"},null,8,["hljs"])]),e[11]||(e[11]=t("div",null,[n("Note about json: by default if a "),t("kbd",null,"grammar"),n(" or "),t("kbd",null,"tsgrammar"),n(" is provided the answer will be formated in json. Use the "),t("kbd",null,"parseJson"),n(" option to change this behavior. ")],-1)),e[12]||(e[12]=t("div",{class:"pt-5"},[t("a",{href:"javascript:openLink('/the_brain/templates/basics')"},"Next: templates")],-1))])]))}});export{L as default};
