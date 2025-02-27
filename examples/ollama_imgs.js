#!/usr/bin/env node
import { useLmBackend, useLmExpert } from "@agent-smith/brain";
import { convertImageDataToBase64 } from "@locallm/api"
//import { useLmBackend } from "../packages/brain/dist/backend.js";
//import { useLmExpert } from "../packages/brain/dist/expert.js";
import * as fs from 'fs';
import * as path from 'path';
import { PromptTemplate } from "modprompt";

// run a local Ollama instance before running this example

const model = "minicpm-v:8b-2.6-q8_0";
const ctx = 8192;
const template = new PromptTemplate("chatml").replaceSystem("You are a photo analyst AI assistant");
const prompt = "Compare the images";
const imgsPaths = ["./img/llama1.jpeg", "./img/llama2.jpeg"];

const backend = useLmBackend({
    name: "ollama",
    localLm: "ollama",
    onToken: (t) => process.stdout.write(t),
});

const ex = useLmExpert({
    name: "default",
    backend: backend,
    template: template,
    model: { name: model, ctx: ctx },
});

async function getImageBuffer(imagePath) {
    try {
        const data = await fs.promises.readFile(path.resolve(path.dirname(new URL(import.meta.url).pathname), imagePath));
        return data;
    } catch (error) {
        throw new Error(`Error reading the image file: ${error.message}`);
    }
}

async function main() {
    // check if the backend is up
    await ex.backend.probe();
    // check expert status: unavailable, available (the model is not loaded), ready
    ex.checkStatus();
    const status = ex.state.get().status;
    if (status == "ready") {
        console.log("The agent is ready\n")
    } else if (status == "available") {
        console.warn(`Loading model ...`);
        // load the model in Ollama
        await ex.loadModel()
    } else {
        console.warn(`The backend is ${status}: please check the inference server`);
        return
    }
    // open images
    const imgs = [];
    const prePrompt = [];
    // convert images to base 64
    let i = 0;
    for (const p of imgsPaths) {
        const buf = await getImageBuffer(p);
        const b64 = await convertImageDataToBase64(buf);
        imgs.push(b64);
        prePrompt.push(`[img-${i}]`)
        ++i
    }
    // patch the prompt
    const finalPrompt = prePrompt.join(" ") + " " + prompt;
    // run inference
    const params = { temperature: 0.2, min_p: 0.05, images: imgs };
    const res = await ex.think(
        finalPrompt,
        params,
    );
    console.log("");
    console.log(res.stats);

}

(async () => {
    await main();
})();
