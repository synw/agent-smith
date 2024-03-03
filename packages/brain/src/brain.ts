import { map } from 'nanostores';
import { InferenceParams, InferenceResult } from "@locallm/types";
import { AgentBrain, LmExpert, LmThinkingOptionsSpec } from "./interfaces.js";

const useAgentBrain = (experts: Array<LmExpert>): AgentBrain => {
    const _experts = experts;
    if (experts.length == 0) {
        throw new Error("Provide a least one expert")
    }
    let _defaultExpert = _experts[0];
    let _currentExpert = _experts[0];
    let stream = _experts[0].stream;
    // state
    const state = map({
        isOn: false,
    });

    const discover = async (isVerbose = false): Promise<boolean> => {
        let isOn = false;
        for (const e of _experts) {
            const isUp = await e.probe(isVerbose);
            if (isUp) {
                isOn = true;
            }
        }
        state.setKey("isOn", isOn)
        return isOn
    }

    const think = async (
        prompt: string, inferenceParams: InferenceParams = {}, options: LmThinkingOptionsSpec = {},
    ): Promise<InferenceResult> => {
        _currentExpert = _defaultExpert;
        return _think(prompt, inferenceParams, options)
    }

    const thinkx = async (
        expertName: string, prompt: string, inferenceParams: InferenceParams = {}, options: LmThinkingOptionsSpec = {},
    ): Promise<InferenceResult> => {
        const ex = _experts.find(e => e.name == expertName);
        if (!ex) {
            throw new Error(`Expert ${expertName} not found`)
        }
        _currentExpert = ex;
        return _think(prompt, inferenceParams, options)
    }

    const abortThinking = async () => {
        await _currentExpert.abortThinking()
    }

    const expert = (name: string) => {
        const ex = _experts.find(e => e.name == name);
        if (!ex) {
            throw new Error(`Expert ${name} not found`)
        }
        return ex
    }

    const _think = async (
        prompt: string, inferenceParams: InferenceParams, options: LmThinkingOptionsSpec,
    ): Promise<InferenceResult> => {
        stream = _currentExpert.stream;
        const res = await _currentExpert.think(prompt, inferenceParams, options);
        return res
    };

    return {
        stream,
        state,
        get ex() {
            return _currentExpert
        },
        experts: _experts,
        discover,
        think,
        thinkx,
        abortThinking,
        expert,
    }
}

export { useAgentBrain }