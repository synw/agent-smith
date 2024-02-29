import{d as g,r as x,o,c as a,a as e,e as i,u as t,H as r,M as d,t as p,f as m,g as u}from"./index-BRk7anpM.js";import{u as f,a as b,b as j}from"./lm-mqbLQnkx.js";const y=f({name:"default",localLm:"koboldcpp",templateName:"chatml"}),k=b([y]),n=j({name:"Joe",modules:[k]}),S=e("div",{class:"prosed"},[e("h1",null,"Templates")],-1),A={class:"flex flex-col space-y-5 mt-5"},T=e("div",null,[u("The templates are managed with the "),e("a",{href:"https://github.com/synw/modprompt"},"Modprompt"),u(" library. Create an expert with a ChatMl template:")],-1),L=e("div",null,"Let's see what the template looks like:",-1),M={key:0,class:"txt-light"},C=e("div",{class:"prose"},[e("h2",null,"System")],-1),N=e("div",null,"Let's add a system message:",-1),B=e("div",null,"The template:",-1),w={key:1,class:"txt-light"},P=e("div",{class:"prose"},[e("h2",null,"Prompt")],-1),E=e("div",null,"To modify the prompt:",-1),V=e("div",null,"The template:",-1),J={key:2,class:"txt-light"},$=e("div",null,"To render the template with a prompt:",-1),H=e("div",null,"The template:",-1),I={key:3,class:"txt-light"},Y=e("div",{class:"pt-5"},[e("a",{href:"javascript:openLink('/the_brain/templates/history')"},"Next: history")],-1),D=`import { useAgentSmith } from "@agent-smith/body";
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

export { joe }`,R=`<div class="text-light">
    <pre>{{ joe.brain.ex.template.render() }}</pre>
</div>`,q=`function addSystemMsg() {
    joe.brain.ex.template.replaceSystem("You are a javascript AI code assistant")
}`,z='function modifyPompt() {\n    joe.brain.ex.template.replacePrompt("fix this invalid json:\n\n```json\n{prompt}\n```")\n}',F='{{ joe.brain.ex.template.prompt("{a: 1,}") }}',U=g({__name:"basics",setup(G){const s=x(1);function h(){n.brain.ex.template.replaceSystem("You are a javascript AI code assistant"),s.value=2}function v(){n.brain.ex.template.replacePrompt("fix this invalid json:\n\n```json\n{prompt}\n```"),s.value=3}function _(){s.value=4}return(K,l)=>(o(),a("div",null,[S,e("div",A,[T,e("div",null,[i(t(d),{hljs:t(r),code:D,lang:"ts"},null,8,["hljs"])]),L,s.value==1?(o(),a("div",M,[e("pre",null,p(t(n).brain.ex.template.render()),1)])):m("",!0),e("div",null,[i(t(d),{hljs:t(r),code:R,lang:"html"},null,8,["hljs"])]),C,N,e("div",null,[e("button",{class:"btn light",onClick:l[0]||(l[0]=c=>h())},"Add system message")]),B,s.value==2?(o(),a("div",w,[e("pre",null,p(t(n).brain.ex.template.render()),1)])):m("",!0),e("div",null,[i(t(d),{hljs:t(r),code:q,lang:"ts"},null,8,["hljs"])]),P,E,e("div",null,[e("button",{class:"btn light",onClick:l[1]||(l[1]=c=>v())},"Modify the prompt")]),V,s.value==3?(o(),a("div",J,[e("pre",null,p(t(n).brain.ex.template.render()),1)])):m("",!0),e("div",null,[i(t(d),{hljs:t(r),code:z,lang:"ts"},null,8,["hljs"])]),$,e("div",null,[e("button",{class:"btn light",onClick:l[2]||(l[2]=c=>_())},"Render the template")]),H,s.value==4?(o(),a("div",I,[e("pre",null,p(t(n).brain.ex.template.prompt("{a: 1,}")),1)])):m("",!0),e("div",null,[i(t(d),{hljs:t(r),code:F,lang:"html"},null,8,["hljs"])]),Y])]))}});export{U as default};
