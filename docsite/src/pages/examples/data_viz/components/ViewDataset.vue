<template>
    <div class="flex flex-col space-y-3 w-full">
        <div class="flex flex-row items-center prosed">
            <h2 class="text-3xl txt-light capitalize">{{ dataset }}</h2>
            <button class="btn bord-lighter txt-light text-sm ml-5" @click="$emit('pick')">Pick another dataset</button>
        </div>
        <template v-if="isReady">
            <div v-html="html" class="pt-3"></div>
            <div class="txt-light text-xl">Queries</div>
            <div class="flex flex-col space-y-2 pt-2">
                <div v-for="_q in queries" @click="selectQuery(_q.q)" class="cursor-pointer">
                    <span>{{ _q.q }}</span> ( {{ _q.level }}B)
                </div>
            </div>
        </template>
        <div v-else class="p-12 w-full flex flex-row items-center justify-center">
            <loading-spinner class="text-5xl"></loading-spinner>
            <div class="txt-light ml-3">Loading data ...</div>
        </div>
        <div class="flex flex-row pt-3">
            <Textarea class="w-[32rem]" v-model="data.query" :rows="1" />
            <button class="btn" :class="data.query.length > 0 ? 'primary' : 'lighter'" @click="createChart()"
                :disabled="!isReady || data.query.length == 0">Create
                chart</button>
        </div>
        <div class="flex flex-col pt-3 w-full" id="tabs">
            <div class="flex flex-row w-full">
                <button class="w-max p-2 border bord-lighter"
                    :class="activeTab == 'params' ? ['border-b-0', 'txt-light'] : 'txt-semilight'"
                    @click="activeTab = 'params'">Inference params</button>
                <button class="w-max p-2 border bord-lighter"
                    :class="activeTab == 'prompt' ? ['border-b-0', 'txt-light'] : 'txt-semilight'"
                    @click="activeTab = 'prompt'">Prompt</button>
                <button class="w-max p-2 border bord-lighter"
                    :class="activeTab == 'code' ? ['border-b-0', 'txt-light'] : 'txt-semilight'"
                    @click="activeTab = 'code'">Generated code</button>
                <button class="w-max p-2 border bord-lighter"
                    :class="activeTab == 'chart' ? ['border-b-0', 'txt-light'] : 'txt-semilight'"
                    @click="activeTab = 'chart'">Chart</button>
                <button class="w-max p-2 border bord-lighter"
                    :class="activeTab == 'error' ? ['border-b-0', 'txt-light'] : 'txt-semilight'"
                    @click="activeTab = 'error'">Error</button>
                <div class="flex border-b bord-lighter flex-grow"></div>
            </div>
            <div class="pt-5">
                <component :is="tabs[activeTab]" :data="data"></component>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { py } from "@/py";
import Textarea from 'primevue/textarea';
import { onMounted, reactive, ref } from "vue";
import { createChartPrompt } from "../prompt";
import { ChartQuery, datasets } from "../datasets";
import ChartTab from "./tabs/ChartTab.vue";
import CodeTab from "./tabs/CodeTab.vue";
import ErrorTab from "./tabs/ErrorTab.vue";
import PromptTab from "./tabs/PromptTab.vue";
import { brain } from "@/agent/agent";
import LoadingSpinner from "@/widgets/LoadingSpinner.vue";
import InferParamsTab from "./tabs/InferParamsTab.vue";

const props = defineProps({
    dataset: {
        type: String,
        required: true,
    }
});

const emit = defineEmits(["pick"]);

const isReady = ref(false);
const data = reactive({
    finalCode: "",
    finalPrompt: "",
    query: "",
    chart: {},
    error: "",
})

const tabs = {
    params: InferParamsTab,
    code: CodeTab,
    chart: ChartTab,
    prompt: PromptTab,
    error: ErrorTab,
};
const activeTab = ref("params");

const html = ref("");
const csv = ref("");
const hasChart = ref(false);
const queries = reactive(new Array<ChartQuery>());
const stop = ref(new Array<string>());

const code1 = `from vega_datasets import data

df = data('${props.dataset}')
df.to_html(classes='table-auto table-striped', max_rows=8, justify='left', col_space='8rem')`;

const code2 = `df.head(8).to_csv(index=False)`;

async function readCsv() {
    const { results, error } = await py.run(code2);
    //console.log("CSV", results, error);
    csv.value = results;
}

async function init() {
    data.finalCode = "";
    data.finalCode = "";
    data.query = "";
    const ds = datasets[props.dataset];
    if (ds.length > 0) {
        //q.value = ds[0].q;
        queries.push(...ds)
    }
    const { results, error } = await py.run(code1);
    //console.log(results, error);
    html.value = results;
    await readCsv();
    isReady.value = true
}

function selectQuery(q: string) {
    data.query = q;
    const { _prompt, tpl } = createChartPrompt(q, csv.value);
    stop.value = tpl.stop ?? [];
    data.finalPrompt = _prompt;
    activeTab.value = "prompt"
}

async function createChart() {
    hasChart.value = false;
    data.chart = {};
    data.finalCode = "";
    activeTab.value = "code";
    document.getElementById("tabs")?.scrollIntoView();
    const res = await brain.think(data.finalPrompt, {
        temperature: 0, max_tokens: 500, top_p: 0.35, top_k: 40, stop: stop.value
    });
    //console.log("R", res.text);
    let code = "";
    try {
        code = _extractCodeBlock(res.text).replace("df = pd.read_csv('data.csv')", `df = data('${props.dataset}')`);
    } catch (e) {
        data.error = `${e}`;
        activeTab.value = 'error';
        return
    }
    //console.log("CODE", code);
    code = code.replace("<|im_end|>", "") + ".to_json()";
    // try to patch inefficient format
    if (!code.startsWith("import")) {
        console.log("Trying to patch code output");
        const toRemove = code.split("import", 1)[0];
        console.log("S", toRemove);
        code = code.replace(toRemove, "");
    }
    data.finalCode = '```python\n' + code + "\n\`\`\`";
    const { results, error } = await py.run(code);
    if (error) {
        console.warn("Code err", error)
        data.error = `${error}`;
        activeTab.value = 'error';
    }
    //console.log("RESULTS", results);
    let r = "";
    try {
        r = _extractCodeBlock(results);
        const json = JSON.parse(r);
        data.chart = json;
        //console.log("JSON", r);
        hasChart.value = true;
        activeTab.value = 'chart';
    } catch (e) {
        data.error = `${e}`;
        activeTab.value = 'error';
        return
    }
}

function _extractCodeBlock(markdown: string): string {
    return markdown.replace("```python\n", "").replace("```", "").trim()
}

function initialQuery() {


}

onMounted(() => {
    brain.discover();
    init();
    //initialQuery();
})
</script>

<style lang="sass">
.dataframe
    @apply border rounded-md
    thead
        @apply lighter
    tbody
        tr
            @apply border-b bord-lighter
</style>