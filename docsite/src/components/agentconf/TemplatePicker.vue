<template>
    <div>
        <div class="p-3 flex flex-wrap gap-3 w-full">
            <div v-for="tpl in sortedTemplates" class="">
                <button class="btn lighter" @click="chooseTemplate(tpl)">
                    {{ tpl.name }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { LmTemplate, templates } from "modprompt";

const emit = defineEmits(["select"]);

const selectedTemplate = ref("none");


function sortObjectByKey(obj: { [key: string]: any }): { [key: string]: any } {
    const keys = Object.keys(obj);
    keys.sort();
    const sortedObj: { [key: string]: any } = {};
    for (const key of keys) {
        sortedObj[key] = obj[key];
    }
    return sortedObj;
}

const sortedTemplates = sortObjectByKey(templates);

function chooseTemplate(tpl: LmTemplate) {
    //console.log("TPL", tpl);
    selectedTemplate.value = tpl.name;
    emit("select", tpl.id);
}
</script>