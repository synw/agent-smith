import { map } from 'nanostores';
import { InferenceParams, InferenceResult } from "@locallm/types";
import { AgentBrain, LmExpert, LmThinkingOptionsSpec } from "./interfaces.js";
import { useLmExpert } from './lm.js';

const useAgentBrain = (experts: Array<LmExpert> = []): AgentBrain => {
    let _experts = experts;
    /*if (experts.length == 0) {
        throw new Error("Provide a least one expert")
    }*/
    let _dummyExpert = useLmExpert({
        name: "dummydefault",
        localLm: "koboldcpp",
        templateName: "none",
    });;
    let _currentExpert = _experts.length > 0 ? _experts[0] : _dummyExpert;
    let stream = _currentExpert.stream;
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

    const discoverExperts = async () => {
        const ex = new Array<LmExpert>();
        const kobold = useLmExpert({
            name: "koboldcpp",
            localLm: "koboldcpp",
        });
        const llamacpp = useLmExpert({
            name: "llamacpp",
            localLm: "llamacpp",
        });
        const ollama = useLmExpert({
            name: "ollama",
            localLm: "ollama",
        });
        const [isKobUp, isLamUp, isOlamUp] = await Promise.all([
            kobold.probe(true),
            llamacpp.probe(true),
            ollama.probe(true),
        ]);
        if (isKobUp) {
            ex.push(kobold)
        }
        if (isLamUp) {
            ex.push(llamacpp)
        }
        if (isOlamUp) {
            ex.push(ollama)
        }
        if (ex.length > 0) {
            state.setKey("isOn", true);
            _experts.push(...ex);
            if (_currentExpert.name == "dummydefault") {
                _currentExpert = ex[0];
            }
            stream = _currentExpert.stream;
        } else {
            state.setKey("isOn", false);
        }
        //console.log("DISCOV EX", _experts.map(e => e.name));
        //console.log("DISCOV CURRENT EX", _currentExpert.name)
    }

    const think = async (
        prompt: string, inferenceParams: InferenceParams = {}, options: LmThinkingOptionsSpec = {},
    ): Promise<InferenceResult> => {
        //console.log("THINK EX", _experts.map(e => e.name));
        //console.log("THINK CEX", _currentExpert.name);
        _checkExpert(_currentExpert);
        return await _currentExpert.think(prompt, inferenceParams, options);
    }

    const thinkx = async (
        expertName: string, prompt: string, inferenceParams: InferenceParams = {}, options: LmThinkingOptionsSpec = {},
    ): Promise<InferenceResult> => {
        const ex = _experts.find(e => e.name == expertName);
        if (!ex) {
            throw new Error(`Expert ${expertName} not found`)
        }
        _currentExpert = ex;
        stream = _currentExpert.stream;
        return await _currentExpert.think(prompt, inferenceParams, options);
    }

    const abortThinking = async () => {
        _checkExpert(_currentExpert);
        await _currentExpert.abortThinking()
    }

    const expert = (name: string) => {
        const ex = _experts.find(e => e.name == name);
        if (!ex) {
            throw new Error(`Expert ${name} not found`)
        }
        return ex
    }

    const resetExperts = () => {
        _experts = [];
        _currentExpert = _dummyExpert;
    }

    const _checkExpert = (_ex: LmExpert) => {
        if (_ex.name == "dummydefault") {
            //console.warn("ERR EX", _experts.map(e => e.name));
            //console.log("ERR CEX", _ex.name);
            throw new Error("No expert is configured")
        }
    }

    return {
        stream,
        state,
        get ex() {
            return _currentExpert
        },
        get experts() {
            return _experts
        },
        discover,
        discoverExperts,
        think,
        thinkx,
        abortThinking,
        expert,
        resetExperts,
    }
}

export { useAgentBrain }