import{d as g,r as x,o,c as a,a as e,e as i,u as t,H as r,M as d,t as p,f as m,g as u}from"./index-CweHuPTs.js";import{u as f,a as b,b as j}from"./lm-Ctwc89wI.js";import"./index-Bda8kKQR.js";import"./_commonjs-dynamic-modules-TDtrdbi3.js";const y=f({name:"default",localLm:"koboldcpp",templateName:"chatml"}),n=b({name:"Joe",brain:j([y])}),k=e("div",{class:"prosed"},[e("h1",null,"Templates")],-1),S={class:"flex flex-col space-y-5 mt-5"},A=e("div",null,[u("The templates are managed with the "),e("a",{href:"https://github.com/synw/modprompt"},"Modprompt"),u(" library. Create an expert with a ChatMl template:")],-1),T=e("div",null,"Let's see what the template looks like:",-1),L={key:0,class:"txt-light"},C=e("div",{class:"prose"},[e("h2",null,"System")],-1),M=e("div",null,"Let's add a system message:",-1),N=e("div",null,"The template:",-1),B={key:1,class:"txt-light"},w=e("div",{class:"prose"},[e("h2",null,"Prompt")],-1),P=e("div",null,"To modify the prompt:",-1),E=e("div",null,"The template:",-1),V={key:2,class:"txt-light"},J=e("div",null,"To render the template with a prompt:",-1),$=e("div",null,"The template:",-1),H={key:3,class:"txt-light"},I=e("div",{class:"pt-5"},[e("a",{href:"javascript:openLink('/the_brain/templates/history')"},"Next: history")],-1),Y=`import { useAgentSmith } from "@agent-smith/body";
import { useLmExpert, useAgentBrain } from "@agent-smith/brain";

const expert = useLmExpert({
    name: "default",
    localLm: "koboldcpp",
    templateName: "chatml",
});
const joe = useAgentSmith({
    name: "Joe",
    modules: [useAgentBrain([expert])],
});

export { joe }`,D=`<div class="text-light">
    <pre>{{ joe.brain.ex.template.render() }}</pre>
</div>`,R=`function addSystemMsg() {
    joe.brain.ex.template.replaceSystem("You are a javascript AI code assistant")
}`,q='function modifyPompt() {\n    joe.brain.ex.template.replacePrompt("fix this invalid json:\n\n```json\n{prompt}\n```")\n}',z='{{ joe.brain.ex.template.prompt("{a: 1,}") }}',W=g({__name:"basics",setup(F){const s=x(1);function h(){n.brain.ex.template.replaceSystem("You are a javascript AI code assistant"),s.value=2}function v(){n.brain.ex.template.replacePrompt("fix this invalid json:\n\n```json\n{prompt}\n```"),s.value=3}function _(){s.value=4}return(G,l)=>(o(),a("div",null,[k,e("div",S,[A,e("div",null,[i(t(d),{hljs:t(r),code:Y,lang:"ts"},null,8,["hljs"])]),T,s.value==1?(o(),a("div",L,[e("pre",null,p(t(n).brain.ex.template.render()),1)])):m("",!0),e("div",null,[i(t(d),{hljs:t(r),code:D,lang:"html"},null,8,["hljs"])]),C,M,e("div",null,[e("button",{class:"btn light",onClick:l[0]||(l[0]=c=>h())},"Add system message")]),N,s.value==2?(o(),a("div",B,[e("pre",null,p(t(n).brain.ex.template.render()),1)])):m("",!0),e("div",null,[i(t(d),{hljs:t(r),code:R,lang:"ts"},null,8,["hljs"])]),w,P,e("div",null,[e("button",{class:"btn light",onClick:l[1]||(l[1]=c=>v())},"Modify the prompt")]),E,s.value==3?(o(),a("div",V,[e("pre",null,p(t(n).brain.ex.template.render()),1)])):m("",!0),e("div",null,[i(t(d),{hljs:t(r),code:q,lang:"ts"},null,8,["hljs"])]),J,e("div",null,[e("button",{class:"btn light",onClick:l[2]||(l[2]=c=>_())},"Render the template")]),$,s.value==4?(o(),a("div",H,[e("pre",null,p(t(n).brain.ex.template.prompt("{a: 1,}")),1)])):m("",!0),e("div",null,[i(t(d),{hljs:t(r),code:z,lang:"html"},null,8,["hljs"])]),I])]))}});export{W as default};
