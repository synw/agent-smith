import{d as b,j as p,s as r,o as c,c as d,f as o,F as f,i as g,g as n,n as v,k as i,e as k,a as t,h as l,H as s,M as a}from"./index-vf8raKft.js";import{R as x}from"./RobotIcon-CmUWRvZu.js";const y={class:"fixed bottom-12 right-8 flex flex-row items-end z-50"},w=["innerHTML"],j=b({__name:"AgentV2",setup(h){const m=p(()=>{let e="txt-lighter";return r.value.isInteracting&&(e="txt-light"),e});return(e,u)=>(c(),d("div",y,[o(r).isVisible?(c(),d(f,{key:0},[o(r).isInteracting===!0?(c(),d("div",{key:0,class:"bubble bubble-bottom-left mr-5 txt-light",innerHTML:o(r).text},null,8,w)):g("",!0),n(x,{class:v(["text-5xl cursor-pointer",m.value]),onClick:u[0]||(u[0]=z=>o(i).toggleInteract())},null,8,["class"])],64)):g("",!0)]))}}),I={class:"flex flex-col space-y-5 mt-5"},M=`.bubble {
    z-index: 20;
    position: relative;
    max-width: 30em;
    background-color: #fff;
    padding: 1.125em 1.5em;
    border-radius: 1rem;
    box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, .3), 0 0.0625rem 0.125rem rgba(0, 0, 0, .2);
}

.bubble-bottom-left:before {
    z-index: 30;
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    left: 98%;
    bottom: 25%;
    rotate: 90deg;
    border: .75rem solid transparent;
    border-top: none;
    border-bottom-color: #fff;
    filter: drop-shadow(0 -0.0625rem 0.0625rem rgba(0, 0, 0, .1));
}`,H=`<div class="fixed bottom-12 right-8 flex flex-row items-end z-50">
    <template v-if="state.isVisible">
        <div v-if="state.isInteracting === true" 
            class="bubble bubble-bottom-left mr-5 txt-light"
            v-html="state.text">
        </div>
        <robot-icon class="text-5xl cursor-pointer" @click="agent.toggleInteract()"></robot-icon>
    </template>
</div>`,T=`<button class="btn light" @click="agent.talk('Hi, I am your demo agent', 3)">Talk</button>`,N=`import { computed } from "vue";

const color = computed(() => {
    let c = "txt-lighter";
    if (state.value.isInteracting) {
        c = "txt-light"
    }
    return c
});`,V=`<robot-icon class="text-5xl cursor-pointer" 
    :class="color" @click="agent.toggleInteract()"></robot-icon>`,B=`import { onBeforeMount } from 'vue';

onBeforeMount(() => {
    agent.show();
    agent.interactions.setKey(
        "click",
        () => agent.talk('Hi, I am your demo agent', 3)
    );
})`,$=b({__name:"talk",setup(h){return k(()=>{i.show(),i.interactions.setKey("click",()=>i.talk("Hi, I am your demo agent",3))}),(m,e)=>(c(),d("div",null,[e[7]||(e[7]=t("div",{class:"prosed"},[t("h1",null,"The talk interaction")],-1)),t("div",I,[e[1]||(e[1]=t("div",null,[l(" Let's give our agent the hability to talk. Let's create a bubble widget: add this css in a "),t("kbd",null,"<style>"),l(" block to the agent component: ")],-1)),t("div",null,[n(o(a),{hljs:o(s),code:M,lang:"css"},null,8,["hljs"])]),e[2]||(e[2]=t("div",null,[l("Modify to component to add the css and map the current "),t("kbd",null,"state.text"),l(" (a reactive variable) to the component content, and "),t("kbd",null,"state.toggleInteract"),l(" to the click action of the component:")],-1)),t("div",null,[n(o(a),{hljs:o(s),code:H,lang:"html"},null,8,["hljs"])]),e[3]||(e[3]=t("div",null,"Now our agent can talk:",-1)),t("div",null,[t("button",{class:"btn light",onClick:e[0]||(e[0]=u=>o(i).talk("Hi, I am Joe, your demo agent",3))},"Talk")]),t("div",null,[n(o(a),{hljs:o(s),code:T,lang:"html"},null,8,["hljs"])]),e[4]||(e[4]=t("div",null,[l(" The second parameter of "),t("kbd",null,"agent.talk"),l(" is the number of seconds it is talking. The duration is optional: it will stay forever by default. Now let's map a ui behavior: the agent will change color when talking. Add this to the script part: ")],-1)),t("div",null,[n(o(a),{hljs:o(s),code:N,lang:"ts"},null,8,["hljs"])]),e[5]||(e[5]=t("div",null," Modify the agent icon to map the css class on the computed property: ",-1)),t("div",null,[n(o(a),{hljs:o(s),code:V,lang:"html"},null,8,["hljs"])]),e[6]||(e[6]=t("div",null," Finally we are going to map the talk action to the click on the agent icon: ",-1)),t("div",null,[n(o(a),{hljs:o(s),code:B,lang:"ts"},null,8,["hljs"])])]),n(j),e[8]||(e[8]=t("div",{class:"mt-8"},[t("a",{href:"javascript:openLink('/the_body/interactions/components')"},"Next: map components on the agent interactions ")],-1))]))}});export{$ as default};
