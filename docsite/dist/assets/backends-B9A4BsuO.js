import{d as i,o as d,c as r,a as l,g as s,f as n,H as t,M as o,h as a}from"./index-56o_VcVb.js";const c={class:"flex flex-col space-y-5 mt-5"},m={class:"flex flex-col space-y-5 mt-5"},u={class:"flex flex-col space-y-5 mt-5"},b={class:"flex flex-col space-y-5 mt-5"},k={class:"flex flex-col space-y-5 mt-5"},p={class:"flex flex-col space-y-5 mt-5"},v=`import { useAgentBrain } from "@agent-smith/brain";

const brain = useAgentBrain();`,g=`import { useLmBackend } from "@agent-smith/brain";

const localBackend = useLmBackend({
    name: "ollama",
    localLm: "ollama",
});`,f=`const remoteBackend = useLmBackend({
    name: "remote_backend",
    serverUrl: "https://myurl.com",
    apiKey: "xyz",
    providerType: "koboldcpp",
});`,j=`const browserBackend = useLmBackend({
    name: "browser",
    localLm: "browser",
});`,h="const brain = useAgentBrain([localBackend, browserBackend]);",B="brain.addBackend(remoteBackend)",x='brain.removeBackend("remote_backend") // backend.name',y=`const backend = useLmBackend({
    name: "ollama",
    localLm: "ollama",
    onToken: (t) => process.stdout.write(t),
});`,w='backend.setOnToken((t: string) => console.log("Incoming token:", t))',T=`const backend = useLmBackend({
    name: "ollama",
    localLm: "ollama",
    onStartEmit: () => console.log("Start streaming"),
});`,L='backend.setOnStartEmit(() => console.log("State: emiting tokens"))',S='console.log("Is the backend up:", backend.state.get().isUp)',z="const isUp = await backend.probe();",E=i({__name:"backends",setup(I){return(O,e)=>(d(),r("div",null,[e[17]||(e[17]=l("div",{class:"prosed"},[l("h1",null,"Backends")],-1)),l("div",c,[e[0]||(e[0]=l("div",null,"The brain module is usable independently of the body.It manages connections to inference servers using backends.",-1)),e[1]||(e[1]=l("div",null,"First initialize a brain instance:",-1)),l("div",null,[s(n(o),{hljs:n(t),code:v,lang:"ts"},null,8,["hljs"])])]),e[18]||(e[18]=l("div",{class:"flex flex-col space-y-5 mt-5"},[l("div",null,"Backends can be a local or remote inference server or a browser for small models.")],-1)),e[19]||(e[19]=l("div",{class:"prosed"},[l("h2",null,"Initialize a backend")],-1)),l("div",m,[e[2]||(e[2]=l("div",null,"Supported local and remote backends: Llama.cpp, Koboldcpp, Ollama.",-1)),e[3]||(e[3]=l("div",null,"Simple local backend:",-1)),l("div",null,[s(n(o),{hljs:n(t),code:g,lang:"ts"},null,8,["hljs"])]),e[4]||(e[4]=l("div",null,[a("The "),l("kbd",null,"localLm"),a(" parameter is used to autoconfigure the local server. Possible values: "),l("code",null,"llamacpp, koboldcpp, ollama, browser")],-1)),e[5]||(e[5]=l("div",null,"Remote backend:",-1)),l("div",null,[s(n(o),{hljs:n(t),code:f,lang:"ts"},null,8,["hljs"])]),e[6]||(e[6]=l("div",null,"Browser backend:",-1)),l("div",null,[s(n(o),{hljs:n(t),code:j,lang:"ts"},null,8,["hljs"])]),e[7]||(e[7]=l("div",null,"Once created the backends must be attached to the brain. It is possible to do it at initialization time or later. Initialize a brain with some backends: ",-1)),l("div",null,[s(n(o),{hljs:n(t),code:h,lang:"ts"},null,8,["hljs"])]),e[8]||(e[8]=l("div",null,"Add a backend to the brain instance:",-1)),l("div",null,[s(n(o),{hljs:n(t),code:B,lang:"ts"},null,8,["hljs"])]),e[9]||(e[9]=l("div",null,"Remove a backend from the brain instance:",-1)),l("div",null,[s(n(o),{hljs:n(t),code:x,lang:"ts"},null,8,["hljs"])])]),e[20]||(e[20]=l("div",{class:"prosed"},[l("h2",null,"Options"),l("h3",null,"On token callback")],-1)),l("div",u,[e[10]||(e[10]=l("div",null,[a("The "),l("kbd",null,"onToken"),a(" callback will be called each time a token is streamed. To set it at initialization time:")],-1)),l("div",null,[s(n(o),{hljs:n(t),code:y,lang:"ts"},null,8,["hljs"])]),e[11]||(e[11]=l("div",null,"To set it at anytime:",-1)),l("div",null,[s(n(o),{hljs:n(t),code:w,lang:"ts"},null,8,["hljs"])])]),e[21]||(e[21]=l("div",{class:"prosed"},[l("h3",null,"On start emit callback")],-1)),l("div",b,[e[12]||(e[12]=l("div",null,[a("The "),l("kbd",null,"onStartEmit"),a(" callback is called when the model emits the first token. It can be used to know when the model is ingesting a prompt and when it is emitting tokens. To set it at initialization time:")],-1)),l("div",null,[s(n(o),{hljs:n(t),code:T,lang:"ts"},null,8,["hljs"])]),e[13]||(e[13]=l("div",null,"To set it at anytime:",-1)),l("div",null,[s(n(o),{hljs:n(t),code:L,lang:"ts"},null,8,["hljs"])])]),e[22]||(e[22]=l("div",{class:"prosed"},[l("h2",null,"State")],-1)),l("div",k,[e[14]||(e[14]=l("div",null,"A state is available to check if the backend is up:",-1)),l("div",null,[s(n(o),{hljs:n(t),code:S,lang:"ts"},null,8,["hljs"])])]),l("div",p,[e[15]||(e[15]=l("div",null,[a("To check if the backend is up use "),l("kbd",null,"probe"),a(":")],-1)),l("div",null,[s(n(o),{hljs:n(t),code:z,lang:"ts"},null,8,["hljs"])]),e[16]||(e[16]=l("div",null,"This will modify the state accordingly and update the backend's models info.",-1))]),e[23]||(e[23]=l("div",{class:"pt-5"},[l("a",{href:"javascript:openLink('/the_brain/experts')"},"Next: experts")],-1))]))}});export{E as default};