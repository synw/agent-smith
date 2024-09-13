import { map } from 'nanostores';
import { InferenceParams, InferenceResult } from "@locallm/types";
import { AgentBrain, LmExpert, LmThinkingOptionsSpec } from "./interfaces.js";
import { useLmExpert } from './lm.js';

const useAgentBrain = (initialExperts: Array<LmExpert> = []): AgentBrain => {
    let _experts = initialExperts;
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
        const experts = await discoverLocal(verbose);
        if (experts.length > 0) {
            await expertsForModelsInfo()
        }
        return state.get().isOn
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

    const discoverLocal = async (setState = true, verbose = false): Promise<Array<LmExpert>> => {
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
        //console.log("DISCOV START", _experts.map(e => e.name));
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
        if (setState) {
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
        }
        //console.log("DISCOV END", _experts.map(e => e.name));
        //console.log("DISCOV CURRENT EX", _currentExpert.name)
        return ex
    }

    const expertsForModelsInfo = async (): Promise<Record<string, string>> => {
        //console.log("Experts:", experts)
        for (const ex of _experts) {
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

    const workingExperts = (): Array<LmExpert> => {
        return _experts.filter((e) => e.state.get().isUp == true && e.lm.model.name != "");
    }

    const setDefaultExpert = (ex: LmExpert | string) => {
        if (typeof ex == "string") {
            _currentExpert = expert(ex);
        } else {
            _currentExpert = ex;
        }
    }

    const addExpert = (ex: LmExpert) => {
        const exists = _experts.find(x => x.name === ex.name) !== undefined;
        if (exists) {
            throw new Error(`Expert ${ex.name} already exists`)
        }
        _experts.push(ex);
    }

    const removeExpert = (name: string) => {
        const index = _experts.findIndex(ex => ex.name === name);
        if (index !== -1) {
            _experts.splice(index, 1);
        } else {
            throw new Error(`Expert ${name} not found: can not remove it`)
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
        addExpert,
        removeExpert,
        workingExperts,
    }
}

export { useAgentBrain }