<template>
    <div>
        <div class="prosed">
            <h1>Overview</h1>
        </div>
        <div class="flex flex-col space-y-5 mt-5">
            <div>The brain of Agent Smith is made of one or several language models. It connects to
                inference servers to make queries and deliver results.</div>
            <div class="prosed">
                <h2>Supported servers</h2>
            </div>
            <div>The brain module works with these local or remote inference servers:</div>
            <div class="prosed">
                <ul>
                    <li><a href="https://github.com/ggerganov/llama.cpp/tree/master/examples/server">Llama.cpp</a></li>
                    <li><a href="https://github.com/LostRuins/koboldcpp">Koboldcpp</a></li>
                    <li><a href="https://github.com/ollama/ollama">Ollama</a></li>
                </ul>
            </div>
            <div>Advice if you have none of these servers available: download a release of Koboldcpp or Ollama,
                it's very easy to install and run.</div>
            <div>
                <div class="prosed">
                    <h2>Inference server config</h2>
                </div>
            </div>
            <div>
                <model-conf></model-conf>
            </div>
            <div class="pt-5">
                <a href="javascript:openLink('the_brain/install')">Next: install</a>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import ModelConf from "@/agent/widgets/ModelConf.vue";
</script>