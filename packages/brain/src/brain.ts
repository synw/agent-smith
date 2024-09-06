import { map } from 'nanostores';
import { InferenceParams, InferenceResult } from "@locallm/types";
import { AgentBrain, LmExpert, LmThinkingOptionsSpec } from "./interfaces.js";
import { useLmExpert } from './lm.js';

const useAgentBrain = (experts: Array<LmExpert> = []): AgentBrain => {
    let _experts = experts;
    const _expertsForModels: Record<string, string> = {};
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

    const initLocal = async (verbose = false): Promise<boolean> => {
        const isUp = await discoverLocal(verbose);
        if (isUp) {
            await expertsForModelsInfo()
        }
        return isUp
    }

    const init = async (verbose = false): Promise<boolean> => {
        const isUp = await discover(verbose);
        if (isUp) {
            await expertsForModelsInfo()
        }
        return isUp
    }

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

    const discoverBrowser = async (verbose = false): Promise<boolean> => {
        const expertExists = _experts.find(x => x.name === "browser") !== undefined;
        if (!expertExists) {
            throw new Error("Expert browser does not exist");
        }
        const bro = expert("browser");
        const isUp = await bro.probe(verbose);
        if (isUp) {
            if (_currentExpert.name == "dummydefault") {
                _currentExpert = bro;
            }
            state.setKey("isOn", true);
            stream = _currentExpert.stream;
        }
        return bro.state.get().isUp
    }

    const discoverLocal = async (verbose = false): Promise<boolean> => {
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
            kobold.probe(verbose),
            llamacpp.probe(verbose),
            ollama.probe(verbose),
        ]);
        if (isKobUp) {
            const expertExists = _experts.find(x => x.name === "koboldcpp") !== undefined;
            if (!expertExists) {
                ex.push(kobold)
            }
        }
        if (isLamUp) {
            const expertExists = _experts.find(x => x.name === "llamacpp") !== undefined;
            if (!expertExists) {
                ex.push(llamacpp)
            }
        }
        if (isOlamUp) {
            const expertExists = _experts.find(x => x.name === "ollama") !== undefined;
            if (!expertExists) {
                ex.push(ollama)
            }
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
        experts.push(..._experts);
        //console.log("DISCOV CURRENT EX", _currentExpert.name)
        return state.get().isOn
    }

    const expertsForModelsInfo = async (): Promise<Record<string, string>> => {
        //console.log("Experts:", experts)
        for (const ex of experts) {
            if (ex.state.get().isUp) {
                if (ex.lm.providerType == "ollama") {
                    await ex.lm.modelsInfo();
                    ex.lm.models.forEach((m) => _expertsForModels[m.name] = ex.name);
                } else if (ex.lm.providerType == "koboldcpp") {
                    _expertsForModels[ex.lm.model.name.replace("koboldcpp/", "")] = ex.name;
                } else {
                    _expertsForModels[ex.lm.model.name] = ex.name;
                }
            }
        }
        return _expertsForModels
        //console.log("MODELS", _expertsForModels);
    }

    const getExpertForModel = (model: string): string | null => {
        let ex: string | null = null;
        if (model in _expertsForModels) {
            ex = _expertsForModels[model];
        }
        return ex
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
        stream = ex.stream;
        return await ex.think(prompt, inferenceParams, options);
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

    const setDefaultExpert = (ex: LmExpert | string) => {
        if (typeof ex == "string") {
            _currentExpert = expert(ex);
        } else {
            _currentExpert = ex;
        }
    }

    const resetExperts = () => {
        _experts = [];
        _currentExpert = _dummyExpert;
    }

    const _checkExpert = (_ex: LmExpert) => {
        if (_ex.name == "dummydefault") {
            throw new Error("No expert is configured")
        }
        if (!_ex.state.get().isUp) {
            throw new Error(`Expert ${_ex.name} is down`)
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
        get expertsForModels() {
            return _expertsForModels
        },
        init,
        initLocal,
        discover,
        discoverLocal,
        discoverBrowser,
        expertsForModelsInfo,
        setDefaultExpert,
        getExpertForModel,
        think,
        thinkx,
        abortThinking,
        expert,
        resetExperts,
    }
}

export { useAgentBrain }