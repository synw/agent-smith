#!/usr/bin/env node
import { useTemplateForModel } from "@agent-smith/tfm";

const tfm = useTemplateForModel();

const models = [
    "deepseek:1.3",
    "DeepSeek-Coder-V2-Lite-Instruct-Q8_0.gguf",
    "phi3.5:3.8b-mini-instruct-q5_K_M",
    "openhermes:7b",
    "gemma2:latest",
    "mistral-nemo:latest",
    "Meta-Llama-3.1-8B-Instruct-Q8_0.gguf",
    "Qwen2.5-32B-Instruct-IQ4_XS.gguf",
    "unknown.gguf"
];

models.forEach((m) => console.log(m, "=>", tfm.guess(m)));