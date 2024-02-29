import{d as a,o as c,c as l,a as t,e as n,u as e,H as o,M as s,g as i}from"./index-CboZIT6v.js";import{_ as d}from"./AgentJoeV3.vue_vue_type_style_index_0_lang-BZstlpzB.js";import"./agent-BFtiMqbc.js";import"./lm-BizhkHiD.js";import"./index-BZxdWYOY.js";import"./RobotIcon-BQcGCiSa.js";import"./_plugin-vue_export-helper-DlAUqK2U.js";const m=t("div",{class:"prosed"},[t("h1",null,"Dynamic component")],-1),p={class:"flex flex-col space-y-5 mt-5"},r=t("div",null,[i("In this part we will map a dynamic component as the agent interaction widget. This way we can use different widgets for our interactions."),t("br"),t("br"),i(" Let's start by setting a dynamic interaction subcomponent in the agent component, instead of using just text. First let's create a basic "),t("kbd",null,"agent/widgets/AgentText.vue"),i(": the template part: ")],-1),h=t("div",null,"The script part:",-1),u=t("div",null,"Map this widget as the default interaction component in the agent component:",-1),g=t("div",null," Map the component to the actual agent state, by listening to the agent's state: ",-1),_=t("div",null,"Update the agent component template to use the dynamic component:",-1),f=t("div",{class:"mt-8"},[t("a",{href:"javascript:openLink('/the_body/interactions/confirm')"},"Next: the confirm interaction")],-1),v='<div v-html="joeState.text"></div>',b='import { joeState } from "../agent";',j=`import { defineAsyncComponent } from "vue";

let AgentContent = defineAsyncComponent(() =>
    import('./widgets/AgentBaseText.vue')
);`,y=`import { defineAsyncComponent, onBeforeUnmount } from "vue";

const unbindListener = joe.state.listen((state, oldState, changed) => {
    if (changed == "component") {
        console.log("** component:", oldState.component, state.component)
        if (state.component != "") {
            let _comp = state.component;
            if (!state.component.endsWith(".vue")) {
                _comp = state.component + ".vue"
            }
            AgentContent = defineAsyncComponent(() =>
                import(/* @vite-ignore */ \`./widgets/\${_comp}\`)
            )
        }
    }
});

onBeforeUnmount(() => unbindListener())`,x=`<div v-if="joeState.isInteracting === true" class="bubble bubble-bottom-left mr-5 txt-light">
    <component :is="AgentContent"></component>
</div>`,U=a({__name:"dynamic_component",setup(w){return(A,C)=>(c(),l("div",null,[m,t("div",p,[r,t("div",null,[n(e(s),{hljs:e(o),code:v,lang:"html"},null,8,["hljs"])]),h,t("div",null,[n(e(s),{hljs:e(o),code:b,lang:"ts"},null,8,["hljs"])]),u,t("div",null,[n(e(s),{hljs:e(o),code:j,lang:"ts"},null,8,["hljs"])]),g,t("div",null,[n(e(s),{hljs:e(o),code:y,lang:"ts"},null,8,["hljs"])]),_,t("div",null,[n(e(s),{hljs:e(o),code:x,lang:"html"},null,8,["hljs"])])]),n(d),f]))}});export{U as default};
