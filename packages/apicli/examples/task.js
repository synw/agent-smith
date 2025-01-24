#!/usr/bin/env node
import { useServer } from "../dist/api.js";

/*
Translate task:

```yaml
name: translate
description: Translate some text
prompt: |-
    I have this text:

    ```
    {prompt}
    ```

    Please translate it to {lang}. Return only the translation. {instructions}
template: 
    system: You are an AI translator assistant
model:
    name: aya-expanse-32b-IQ4_XS
    ctx: 8192
    template: command-r
models:
    xsmall:
        name: granite3.1-dense:2b-instruct-q8_0
        ctx: 8192
        template: chatml
    small:
        name: aya-expanse:8b-q6_K
        ctx: 8192
        template: chatml
    large:
        name: aya-expanse-32b-IQ4_XS
        ctx: 8192
        template: command-r
inferParams:
    max_tokens: 4096
    top_k: 0
    top_p: 0
    min_p: 0.05
    temperature: 0.1
variables:
    optional:
        - instructions
    required:
        - lang
```
*/

async function main() {
    const api = useServer({
        apiKey: "30f224ea6b45af61356b8eb0bd84d2011f6f85dec6d49716c686cff66510efba",
        onToken: (t) => process.stdout.write(t),
    });
    await api.executeTask("translate", "Which is the largest planet of the solar system?", { lang: "spanish" })
}

(async () => { await main() })()