import { useAgentSmith } from "./core.js";

/**
 * Interface for the specification of an agent.
 *
 * @property {string} name - The name of the agent.
 * @property {Array<AgentJob>} jobs - The jobs that the agent will perform. This is optional.
 * @property {Record<string, any>} [props] - The properties of the agent. This is optional.
 * @property {Array<Record<string, any>>} [modules] - The extra modules used by the agent. This is optional.
 */
interface AgentSpec {
    name: string;
    props?: Record<string, any>;
    modules?: Array<Record<string, any>>;
}

/**
 * Interface for the options of a confirmation.
 *
 * @property {() => Promise<void>} [onDecline] - The function to call when the confirmation is declined. This is optional.
 * @property {string} [component] - The component to display. This is optional.
 * @property {boolean} [pop] - Whether to pop up the confirmation. This is optional.
 */
interface ConfirmOptions {
    onDecline?: () => Promise<void>;
    component?: string;
    pop?: boolean;
}

/**
 * Type for the function to confirm something.
 */
type ConfirmFunction = (text: string, onConfirm: () => Promise<void>, options?: ConfirmOptions) => Promise<void>;

/**
 * Type for the function to talk.
 */
type TalkFunction = (text: string, duration?: number, component?: string) => Promise<void>;

/**
 * Type for an agent.
 */
type Agent = ReturnType<typeof useAgentSmith>;

/**
 * Type for JSON data.
 */
type JsonData = Record<string, any> | Array<any>;

/**
 * Export all the interfaces and types.
 */
export {
    AgentSpec,
    Agent,
    JsonData,
    ConfirmFunction,
    ConfirmOptions,
    TalkFunction,
}
