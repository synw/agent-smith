<template>
    <div class="flex flex-wrap gap-2 text-xs">
        <div>Presets:</div>
        <chip-text class="cursor-pointer" :class="ctx == 256 ? 'secondary' : 'lighter'"
            @click="preset(256)">256</chip-text>
        <chip-text class="cursor-pointer" :class="ctx == 512 ? 'secondary' : 'lighter'"
            @click="preset(512)">512</chip-text>
        <chip-text class="cursor-pointer" :class="ctx == 1024 ? 'secondary' : 'lighter'"
            @click="preset(1024)">1k</chip-text>
        <chip-text class="cursor-pointer" :class="ctx == 2048 ? 'secondary' : 'lighter'"
            @click="preset(2048)">2k</chip-text>
        <chip-text class="cursor-pointer" :class="ctx == 4096 ? 'secondary' : 'lighter'"
            @click="preset(4096)">4k</chip-text>
        <chip-text class="cursor-pointer" :class="ctx == 8192 ? 'secondary' : 'lighter'"
            @click="preset(8192)">8k</chip-text>
        <chip-text class="cursor-pointer" :class="ctx == 16384 ? 'secondary' : 'lighter'"
            @click="preset(16384)">16k</chip-text>
        <chip-text class="cursor-pointer" :class="ctx == 32768 ? 'secondary' : 'lighter'"
            @click="preset(32768)">32k</chip-text>
        <chip-text class="cursor-pointer" :class="ctx == 65536 ? 'secondary' : 'lighter'"
            @click="preset(65536)">64k</chip-text>
        <chip-text class="cursor-pointer" :class="ctx == 131072 ? 'secondary' : 'lighter'"
            @click="preset(131072)">128k</chip-text>
    </div>
</template>

<script setup lang="ts">
import ChipText from "@/widgets/ChipText.vue";

const emit = defineEmits(["select"]);

defineProps({
    ctx: {
        type: Number,
        required: true
    }
})

function preset(n: number) {
    emit("select", n);
}
</script>