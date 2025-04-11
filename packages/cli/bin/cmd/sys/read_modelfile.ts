import { ModelSpec } from "../../interfaces.js";
import { default as fs } from "fs";
import YAML from 'yaml';

function readModelsFile(fp: string): { found: boolean, ctx: number, max_tokens: number, models: Record<string, ModelSpec> } {
    if (!fs.existsSync(fp)) {
        return { models: {}, ctx: 0, max_tokens: 0, found: false }
    }
    const data = fs.readFileSync(fp, 'utf8');
    const m = YAML.parse(data);
    if (!m?.ctx) {
        throw new Error(`provide a ctx param in models file`)
    }
    if (!m?.max_tokens) {
        throw new Error(`provide a max_tokens param in models file`)
    }
    const ctx = m.ctx;
    const max_tokens = m.max_tokens;
    delete m.ctx;
    delete m.max_tokens;
    return { models: m as Record<string, ModelSpec>, ctx: ctx, max_tokens: max_tokens, found: true }
}

export {
    readModelsFile,
}