#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import { Lm, convertImageDataToBase64 } from "@locallm/api";
import { Agent } from "../packages/agent/dist/main.js";

const _prompt = "Describe the image";
const model = {
    name: "qwen2.5vl:3b",
    ctx: 8192,
};
const template = "chatml";
const imgPath = "./img/llama1.jpeg";

async function getImageBuffer(imagePath) {
    try {
        const data = await fs.promises.readFile(path.resolve(path.dirname(new URL(import.meta.url).pathname), imagePath));
        return data;
    } catch (error) {
        throw new Error(`Error reading the image file: ${error.message}`);
    }
}

async function main() {
    const lm = new Lm({
        providerType: "ollama",
        serverUrl: "http://localhost:11434",
        onToken: (t) => process.stdout.write(t),
    });
    const agent = new Agent(lm);
    // open images
    const imgs = [];
    const buf = await getImageBuffer(imgPath);
    const b64 = await convertImageDataToBase64(buf);
    imgs.push(b64);
    const prePrompt = "[img-0]";
    // patch the prompt
    const finalPrompt = prePrompt + " " + _prompt;
    // run
    await agent.run(finalPrompt,
        //inference params
        {
            stream: true,
            model: model,
            template: template,
            temperature: 0.6,
            top_k: 40,
            top_p: 0.95,
            min_p: 0,
            max_tokens: 2048,
            images: imgs,
        },
        // query options
        {
            debug: true,
        }
    );
}

(async () => {
    await main();
})();
