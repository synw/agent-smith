import{d as b,h as p,o as c,c as d,u as e,F as f,f as h,e as o,n as v,b as _,a as t,H as i,M as s,g as n}from"./index-CweHuPTs.js";import{j as r,a}from"./agent-pKjF91oY.js";import{R as k}from"./RobotIcon-by7nlBQk.js";import"./lm-Ctwc89wI.js";import"./index-Bda8kKQR.js";import"./_commonjs-dynamic-modules-TDtrdbi3.js";import"./index-DTVJnmFC.js";import"./_plugin-vue_export-helper-DlAUqK2U.js";const x={class:"fixed bottom-12 right-8 flex flex-row items-end z-50"},j=["innerHTML"],y=b({__name:"AgentJoeV2",setup(g){const u=p(()=>{let l="txt-lighter";return r.value.isInteracting&&(l="txt-light"),l});return(l,m)=>(c(),d("div",x,[e(r).isVisible?(c(),d(f,{key:0},[e(r).isInteracting===!0?(c(),d("div",{key:0,class:"bubble bubble-bottom-left mr-5 txt-light",innerHTML:e(r).text},null,8,j)):h("",!0),o(k,{class:v(["text-5xl cursor-pointer",u.value]),onClick:m[0]||(m[0]=A=>e(a).toggleInteract())},null,8,["class"])],64)):h("",!0)]))}}),w=t("div",{class:"prosed"},[t("h1",null,"The talk interaction")],-1),I={class:"flex flex-col space-y-5 mt-5"},M=t("div",null,[n(" Let's give our agent the hability to talk. Let's create a bubble widget: add this css in a "),t("kbd",null,"<style>"),n(" block to the agent component: ")],-1),H=t("div",null,[n("Modify to component to add the css and map the current "),t("kbd",null,"joeState.text"),n(" (a reactive variable) to the component content, and "),t("kbd",null,"joeState.toggleInteract"),n(" to the click action of the component:")],-1),S=t("div",null,"Now our agent can talk:",-1),T=t("div",null,[n(" The second parameter of "),t("kbd",null,"joe.talk"),n(" is the number of seconds it is talking. The duration is optional: it will stay forever by default. Now let's map a ui behavior: the agent will change color when talking. Add this to the script part: ")],-1),N=t("div",null," Modify the agent icon to map the css class on the computed property: ",-1),V=t("div",null," Finally we are going to map the talk action to the click on the agent icon: ",-1),B=t("div",{class:"mt-8"},[t("a",{href:"javascript:openLink('/the_body/interactions/components')"},"Next: map components on the agent interactions ")],-1),J=`.bubble {
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
}`,z=`<div class="fixed bottom-12 right-8 flex flex-row items-end z-50">
    <template v-if="joeState.isVisible">
        <div v-if="joeState.isInteracting === true" 
            class="bubble bubble-bottom-left mr-5 txt-light"
            v-html="joeState.text">
        </div>
        <robot-icon class="text-5xl cursor-pointer" @click="joe.toggleInteract()"></robot-icon>
    </template>
</div>`,C=`<button class="btn light" @click="joe.talk('Hi, I am Joe, your demo agent', 3)">Talk</button>`,L=`import { computed } from "vue";

const color = computed(() => {
    let c = "txt-lighter";
    if (joeState.value.isInteracting) {
        c = "txt-light"
    }
    return c
});`,$=`<robot-icon class="text-5xl cursor-pointer" 
    :class="color" @click="joe.toggleInteract()"></robot-icon>`,F=`import { onBeforeMount } from 'vue';

onBeforeMount(() => {
    joe.show();
    joe.interactions.setKey(
        "click",
        () => joe.talk('Hi, I am Joe, your demo agent', 3)
    );
})`,Q=b({__name:"talk",setup(g){return _(()=>{a.show(),a.interactions.setKey("click",()=>a.talk("Hi, I am Joe, your demo agent",3))}),(u,l)=>(c(),d("div",null,[w,t("div",I,[M,t("div",null,[o(e(s),{hljs:e(i),code:J,lang:"css"},null,8,["hljs"])]),H,t("div",null,[o(e(s),{hljs:e(i),code:z,lang:"html"},null,8,["hljs"])]),S,t("div",null,[t("button",{class:"btn light",onClick:l[0]||(l[0]=m=>e(a).talk("Hi, I am Joe, your demo agent",3))},"Talk")]),t("div",null,[o(e(s),{hljs:e(i),code:C,lang:"html"},null,8,["hljs"])]),T,t("div",null,[o(e(s),{hljs:e(i),code:L,lang:"ts"},null,8,["hljs"])]),N,t("div",null,[o(e(s),{hljs:e(i),code:$,lang:"html"},null,8,["hljs"])]),V,t("div",null,[o(e(s),{hljs:e(i),code:F,lang:"ts"},null,8,["hljs"])])]),o(y),B]))}});export{Q as default};
