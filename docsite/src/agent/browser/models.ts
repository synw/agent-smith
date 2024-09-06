import { ExpertModelConf } from "./interfaces";

const browserModels: Array<ExpertModelConf> = [
    {
        name: "smollm-135m-instruct",
        url: "https://huggingface.co/HuggingFaceTB/smollm-135M-instruct-v0.2-Q8_0-GGUF/resolve/main/smollm-135m-instruct-add-basics-q8_0.gguf",
        ctx: 2048,
        template: "chatml",
        info: {
            size: "135m",
            quant: "q8"
        }
    },
    {
        name: "smollm-360m-instruct",
        url: "https://huggingface.co/HuggingFaceTB/smollm-360M-instruct-v0.2-Q8_0-GGUF/resolve/main/smollm-360m-instruct-add-basics-q8_0.gguf",
        ctx: 2048,
        template: "chatml",
        info: {
            size: "360m",
            quant: "q8"
        }
    },
    {
        name: "qween-0.5b",
        url: "https://huggingface.co/Qwen/Qwen2-0.5B-Instruct-GGUF/resolve/main/qwen2-0_5b-instruct-q5_k_m.gguf",
        ctx: 32768,
        template: "chatml",
        info: {
            size: "0.5b",
            quant: "q5k_m"
        }
    },
    {
        name: "tinyllama-chat-1.1b",
        url: [
            "https://huggingface.co/ngxson/wllama-split-models/blob/main/tinyllama-1.1b-chat-v1.0.Q4_K_M-00001-of-00003.gguf",
            "https://huggingface.co/ngxson/wllama-split-models/blob/main/tinyllama-1.1b-chat-v1.0.Q4_K_M-00002-of-00003.gguf",
            "https://huggingface.co/ngxson/wllama-split-models/blob/main/tinyllama-1.1b-chat-v1.0.Q4_K_M-00003-of-00003.gguf",
        ],
        ctx: 2048,
        template: "zephyr",
        info: {
            size: "1.1b",
            quant: "q4k_m"
        }
    },
];

export { browserModels }