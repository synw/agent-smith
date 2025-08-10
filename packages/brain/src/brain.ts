import { map } from 'nanostores';
import { InferenceParams, InferenceResult } from "@locallm/types";
import { AgentBrain, LmBackend, LmExpert, LmThinkingOptionsSpec } from "./interfaces.js";
import { useLmBackend } from './backend.js';
import { useLmExpert } from './expert.js';

const useAgentBrain = <P extends Record<string, any> = Record<string, any>>(
    initialBackends: Array<LmBackend> = [], initialExperts: Array<LmExpert<P>> = []
): AgentBrain<P> => {
    let _backends = initialBackends;
    let _experts = initialExperts;
    const _backendsForModels: Record<string, string> = {};
    let _dummyExpert = { name: "dummydefault" } as LmExpert<P>;
    let _currentExpert = _experts.length > 0 ? _experts[0] : _dummyExpert;
    let stream = _currentExpert.stream;
    // state
    const state = map({
        isOn: false,
    });

    const initLocal = async (setState = true, verbose = false): Promise<boolean> => {
        await discoverLocal(setState, verbose);
        if (_backends.length > 0) {
            await backendsForModelsInfo()
        }
        return state.get().isOn
    }

    const init = async (verbose = false): Promise<boolean> => {
        const isUp = await discover(verbose);
        if (isUp) {
            await backendsForModelsInfo()
        }
        return isUp
    }

    const discover = async (isVerbose = false): Promise<boolean> => {
        //console.log("Discover", _backends.map(n => { return `${n.name} / ${n.lm.serverUrl}`}))
        let isOn = false;
        for (const bc of _backends) {            
            const isUp = await bc.probe(isVerbose);
            if (isUp) {
                isOn = true;
            }
            //console.log("Probe", bc.name, isUp);
        }
        state.setKey("isOn", isOn)
        stream = _currentExpert.stream;
        return isOn
    }

    const discoverBrowser = async (verbose = false): Promise<boolean> => {
        const backendExists = _backends.find(x => x.name === "browser") !== undefined;
        if (!backendExists) {
            throw new Error("Backend browser does not exist");
        }
        const bro = backend("browser");
        const isUp = await bro.probe(verbose);
        if (isUp) {
            state.setKey("isOn", true);
            stream = _currentExpert.stream;
        }
        return bro.state.get().isUp
    }

    const discoverLocal = async (setState = true, verbose = false): Promise<Array<LmBackend>> => {
        const foundBackends = new Array<LmBackend>();
        const kobold = useLmBackend({
            name: "koboldcpp",
            localLm: "koboldcpp",
        });
        const llamacpp = useLmBackend({
            name: "llamacpp",
            localLm: "llamacpp",
        });
        const ollama = useLmBackend({
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
            const backendExists = _backends.find(x => x.name === "koboldcpp") !== undefined;
            if (!backendExists) {
                foundBackends.push(kobold)
            }
        }
        if (isLamUp) {
            const backendExists = _backends.find(x => x.name === "llamacpp") !== undefined;
            if (!backendExists) {
                foundBackends.push(llamacpp)
            }
        }
        if (isOlamUp) {
            const backendExists = _backends.find(x => x.name === "ollama") !== undefined;
            if (!backendExists) {
                foundBackends.push(ollama)
            }
        }
        //console.log("BRAIN BACKENDS", _backends.map(b => b.name), setState);
        if (setState) {
            if (foundBackends.length > 0) {
                state.setKey("isOn", true);
                _backends.push(...foundBackends);
                stream = _currentExpert.stream;
            } else {
                state.setKey("isOn", false);
            }
        }
        return foundBackends
    }

    const backendsForModelsInfo = async (): Promise<Record<string, string>> => {
        //console.log("Experts:", experts)
        for (const backend of _backends) {
            //console.log("BS", backend.lm.name, backend.state.get().isUp);
            if (backend.state.get().isUp) {
                if (backend.lm.providerType == "ollama" || backend.lm.providerType == "browser") {
                    await backend.lm.modelsInfo();
                    //console.log("BACKEND", backend.name, backend.lm.models);
                    backend.lm.models.forEach((m) => _backendsForModels[m.name] = backend.name);
                } else {
                    _backendsForModels[backend.lm.model.name] = backend.name;
                }
            }
        }
        return _backendsForModels
        //console.log("MODELS", _backendsForModels);
    }

    const getBackendForModel = (model: string): string | null => {
        let bc: string | null = null;
        if (model in _backendsForModels) {
            bc = _backendsForModels[model];
        }
        return bc
    }

    const getExpertForModel = (modelName: string): LmExpert<P> | null => {
        let _ex: LmExpert<P> | null = null;
        const foundEx = _experts.find(e => e.name == modelName);
        if (foundEx) {
            _ex = foundEx
        }
        if (_ex) {
            _ex.checkStatus()
        }
        return _ex
    }

    const getOrCreateExpertForModel = (modelName: string, templateName: string): LmExpert<P> | null => {
        let _ex: LmExpert<P> | null = null;
        const foundEx = _experts.find(e => e.name == modelName);
        if (foundEx) {
            _ex = foundEx
        }
        //console.log("Havebc" ,modelName,":", Object.keys(_backendsForModels).includes(modelName), _backendsForModels);
        if (Object.keys(_backendsForModels).includes(modelName)) {
            const bc = backend(_backendsForModels[modelName]);
            //console.log("BCP", bc.lm.providerType, ["llamapcpp", "koboldcpp"].includes(bc.lm.providerType));
            if (["llamacpp", "koboldcpp"].includes(bc.lm.providerType)) {
                _ex = useLmExpert<P>({
                    name: modelName,
                    model: bc.lm.model,
                    template: templateName,
                    backend: bc
                });
            } else {
                const m = bc.lm.models.find(x => x.name == modelName);
                if (m) {
                    _ex = useLmExpert<P>({
                        name: modelName,
                        model: m,
                        template: templateName,
                        backend: bc
                    });
                }
            }
        }
        if (_ex) {
            _ex.checkStatus()
        }
        return _ex
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

    const workingExperts = (): Array<LmExpert<P>> => {
        return _experts.filter((e) => ["available", "ready"].includes(e.state.get().status));
    }

    const setDefaultExpert = (ex: LmExpert<P> | string) => {
        //console.log("Set default expert", ex);
        if (typeof ex == "string") {
            _currentExpert = expert(ex);
        } else {
            _currentExpert = ex;
        }
    }

    const addExpert = (ex: LmExpert<P>) => {
        const exists = _experts.find(x => x.name === ex.name) !== undefined;
        if (exists) {
            throw new Error(`Expert ${ex.name} already exists`)
        }
        //console.log("ADD EXP", ex.name);
        _experts.push(ex);
        if (_currentExpert.name == "dummydefault") {
            setDefaultExpert(ex);
        }
    }

    const removeExpert = (name: string) => {
        const index = _experts.findIndex(ex => ex.name === name);
        if (index !== -1) {
            _experts.splice(index, 1);
            if (_currentExpert.name == name) {
                _currentExpert = { name: "dummydefault" } as LmExpert<P>;
            }
        } else {
            throw new Error(`Expert ${name} not found: can not remove it`)
        }
    }

    const addBackend = (bc: LmBackend) => {
        const exists = _backends.find(x => x.name === bc.name) !== undefined;
        if (exists) {
            throw new Error(`Backend ${bc.name} already exists`)
        }
        _backends.push(bc);
    }

    const removeBackend = (name: string) => {
        const index = _backends.findIndex(x => x.name === name);
        if (index !== -1) {
            _backends.splice(index, 1);
        } else {
            throw new Error(`Backend ${name} not found: can not remove it`)
        }
    }

    const backend = (name: string) => {
        const bc = _backends.find(x => x.name == name);
        if (!bc) {
            throw new Error(`Backend ${name} not found`)
        }
        return bc
    }

    const resetExperts = () => {
        _experts = [];
        _currentExpert = _dummyExpert;
    }

    const _checkExpert = (_ex: LmExpert<P>) => {
        if (_ex.name == "dummydefault") {
            throw new Error("No expert is configured")
        }
        if (!(_ex.state.get().status == "ready")) {
            throw new Error(`Expert ${_ex.name} is down: status: ${_ex.state.get().status}`)
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
        get backendsForModels() {
            return _backendsForModels
        },
        get backends() {
            return _backends
        },
        init,
        initLocal,
        discover,
        discoverLocal,
        discoverBrowser,
        getBackendForModel,
        backendsForModelsInfo,
        setDefaultExpert,
        think,
        thinkx,
        abortThinking,
        expert,
        resetExperts,
        addExpert,
        removeExpert,
        getExpertForModel,
        getOrCreateExpertForModel,
        workingExperts,
        backend,
        addBackend,
        removeBackend,
    }
}

export { useAgentBrain }