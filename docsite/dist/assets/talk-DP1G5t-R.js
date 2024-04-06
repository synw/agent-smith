import{d as g,j as p,s as c,o as r,c as d,u as e,F as f,h as m,e as o,n as v,k as i,b as k,a as t,H as s,M as a,i as n}from"./index-C1UhW6KS.js";import{R as _}from"./RobotIcon-BGbJYAEB.js";const x={class:"fixed bottom-12 right-8 flex flex-row items-end z-50"},y=["innerHTML"],w=g({__name:"AgentV2",setup(b){const h=p(()=>{let l="txt-lighter";return c.value.isInteracting&&(l="txt-light"),l});return(l,u)=>(r(),d("div",x,[e(c).isVisible?(r(),d(f,{key:0},[e(c).isInteracting===!0?(r(),d("div",{key:0,class:"bubble bubble-bottom-left mr-5 txt-light",innerHTML:e(c).text},null,8,y)):m("",!0),o(_,{class:v(["text-5xl cursor-pointer",h.value]),onClick:u[0]||(u[0]=K=>e(i).toggleInteract())},null,8,["class"])],64)):m("",!0)]))}}),j=t("div",{class:"prosed"},[t("h1",null,"The talk interaction")],-1),I={class:"flex flex-col space-y-5 mt-5"},M=t("div",null,[n(" Let's give our agent the hability to talk. Let's create a bubble widget: add this css in a "),t("kbd",null,"<style>"),n(" block to the agent component: ")],-1),H=t("div",null,[n("Modify to component to add the css and map the current "),t("kbd",null,"state.text"),n(" (a reactive variable) to the component content, and "),t("kbd",null,"state.toggleInteract"),n(" to the click action of the component:")],-1),T=t("div",null,"Now our agent can talk:",-1),N=t("div",null,[n(" The second parameter of "),t("kbd",null,"agent.talk"),n(" is the number of seconds it is talking. The duration is optional: it will stay forever by default. Now let's map a ui behavior: the agent will change color when talking. Add this to the script part: ")],-1),V=t("div",null," Modify the agent icon to map the css class on the computed property: ",-1),B=t("div",null," Finally we are going to map the talk action to the click on the agent icon: ",-1),z=t("div",{class:"mt-8"},[t("a",{href:"javascript:openLink('/the_body/interactions/components')"},"Next: map components on the agent interactions ")],-1),C=`.bubble {
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
}`,L=`<div class="fixed bottom-12 right-8 flex flex-row items-end z-50">
    <template v-if="state.isVisible">
        <div v-if="state.isInteracting === true" 
            class="bubble bubble-bottom-left mr-5 txt-light"
            v-html="state.text">
        </div>
        <robot-icon class="text-5xl cursor-pointer" @click="agent.toggleInteract()"></robot-icon>
    </template>
</div>`,$=`<button class="btn light" @click="agent.talk('Hi, I am your demo agent', 3)">Talk</button>`,F=`import { computed } from "vue";

const color = computed(() => {
    let c = "txt-lighter";
    if (state.value.isInteracting) {
        c = "txt-light"
    }
    return c
});`,A=`<robot-icon class="text-5xl cursor-pointer" 
    :class="color" @click="agent.toggleInteract()"></robot-icon>`,J=`import { onBeforeMount } from 'vue';

onBeforeMount(() => {
    agent.show();
    agent.interactions.setKey(
        "click",
        () => agent.talk('Hi, I am your demo agent', 3)
    );
})`,S=g({__name:"talk",setup(b){return k(()=>{i.show(),i.interactions.setKey("click",()=>i.talk("Hi, I am your demo agent",3))}),(h,l)=>(r(),d("div",null,[j,t("div",I,[M,t("div",null,[o(e(a),{hljs:e(s),code:C,lang:"css"},null,8,["hljs"])]),H,t("div",null,[o(e(a),{hljs:e(s),code:L,lang:"html"},null,8,["hljs"])]),T,t("div",null,[t("button",{class:"btn light",onClick:l[0]||(l[0]=u=>e(i).talk("Hi, I am Joe, your demo agent",3))},"Talk")]),t("div",null,[o(e(a),{hljs:e(s),code:$,lang:"html"},null,8,["hljs"])]),N,t("div",null,[o(e(a),{hljs:e(s),code:F,lang:"ts"},null,8,["hljs"])]),V,t("div",null,[o(e(a),{hljs:e(s),code:A,lang:"html"},null,8,["hljs"])]),B,t("div",null,[o(e(a),{hljs:e(s),code:J,lang:"ts"},null,8,["hljs"])])]),o(w),z]))}});export{S as default};
