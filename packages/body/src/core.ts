import { map } from 'nanostores'
import { type AgentSpec, type ConfirmFunction, type ConfirmOptions } from "./interfaces.js";

const useAgentSmith = (initParams: AgentSpec) => {
    const name = initParams.name;
    const props = initParams.props ?? {};
    const modules = initParams.modules;
    //public state
    const state = map({
        text: "",
        component: "AgentBaseText",
        isVisible: false,
        isInteracting: false,
    });
    // internal state
    let _cancelConfirm = false;
    let _interactionTimeout: NodeJS.Timeout | null = null;
    let _cancelInteractionTimer: (reason?: any) => void = () => null;
    // user interactions
    const interactions = map<{ confirm: () => void, decline: () => void, click: (() => void) | null }>({
        confirm: () => { },
        decline: () => { },
        click: null,
    });

    const show = () => {
        state.setKey("isVisible", true);
    }

    const hide = () => {
        state.setKey("isVisible", false);
    }

    const talk = async (text: string, duration: number = 0, component?: string) => {
        if (state.get().isInteracting) {
            if (_interactionTimeout) {
                _cancelInteractionTimer()
            }
            _cancelConfirm = true;
            state.setKey("isInteracting", true);
        }
        if (component) {
            state.setKey("component", component);
        }
        state.setKey("text", text);
        state.setKey("isInteracting", true);
        const _duration = duration ?? 3;
        if (_duration > 0) {
            const promise = new Promise((resolve, reject) => {
                _cancelInteractionTimer = () => {
                    if (_interactionTimeout) {
                        clearTimeout(_interactionTimeout);
                        _interactionTimeout = null;
                    }
                    reject();
                    _cancelInteractionTimer = () => null;
                }
                _interactionTimeout = setTimeout(() => {
                    resolve(true);
                }, _duration * 1000);
            });
            await promise;
            _interactionTimeout = null;
            _cancelInteractionTimer = () => null;
            state.setKey("isInteracting", false);
        }
    }

    const confirm: ConfirmFunction = async (
        text: string,
        onConfirm: () => Promise<void>,
        options?: ConfirmOptions,
    ) => {
        const _options = options ?? { pop: true };
        //console.log("Confirm", _text);
        if (state.get().isInteracting) {
            state.setKey("isInteracting", false);
            if (_interactionTimeout) {
                clearTimeout(_interactionTimeout)
            }
        }
        if (_options.component) {
            state.setKey("component", _options.component);
        }
        state.setKey("text", text);
        state.setKey("isInteracting", true);
        if (_options.pop === false) {
            state.setKey("isInteracting", true);
        }
        interactions.setKey("confirm", async () => {
            if (!_cancelConfirm) {
                state.setKey("isInteracting", false);
            } else {
                _cancelConfirm = false;
            }
            try {
                console.log("ON CONFIRM");
                await onConfirm();
            } catch (e) {
                throw new Error(`Error running confirm confirmation callback: ${e}`)
            }
        });
        interactions.setKey("decline", async () => {
            if (!_cancelConfirm) {
                state.setKey("isInteracting", false);
            } else {
                _cancelConfirm = false;
            }
            if (_options.onDecline) {
                try {
                    await _options.onDecline()
                } catch (e) {
                    throw new Error(`Error running confirm declination callback: ${e}`)
                }
            }
        });
    };

    const toggleInteract = () => {
        if (state.get().isInteracting) {
            state.setKey("isInteracting", false);
        } else {
            const onClick = interactions.get().click;
            if (onClick) {
                state.setKey("isInteracting", true);
                onClick();
            }
        }
    }

    const mute = () => {
        //console.log("Muting agent");
        if (_interactionTimeout) {
            clearTimeout(_interactionTimeout);
            _interactionTimeout = null;
        }
        state.setKey("isInteracting", false);
        interactions.setKey("click", null);
    }

    let rt: Record<string, any> = {
        state,
        name,
        interactions,
        props,
        show,
        hide,
        talk,
        confirm,
        toggleInteract,
        mute,
    }

    if (modules) {
        modules.forEach((m) => rt = { ...m, ...rt });
    }

    return rt
}

export { useAgentSmith }