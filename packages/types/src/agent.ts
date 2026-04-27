
/**
 * @file Defines the parameters for an Agent, including callbacks and language model provider.
 * @example
 * import { AgentParams } from './agent-params';
 * import { MyLmProvider } from './lm';
 * import { MyCallbacks } from './callbacks';
 *
 * const agentParams: AgentParams = {
 *   name: 'MyAgent',
 *   lm: new MyLmProvider(),
 *   onMessage: (msg) => console.log(msg),
 *   onError: (err) => console.error(err),
 * };
 */

import type { AllCallbacks } from "./callbacks.js";
import type { LmProvider } from "./lm.js";

/**
 * Represents the parameters required to configure an Agent.
 *
 * @interface AgentParams
 * @augments AllCallbacks
 * @param {string} [name] - Optional name for the agent.
 * @param {LmProvider} lm - The language model provider used by the agent.
 * @example
 * const agentParams: AgentParams = {
 *   name: 'AssistantAgent',
 *   lm: new OpenAILMProvider(),
 *   onMessage: (message) => console.log(`Received: ${message}`),
 *   onError: (error) => console.error(`Error: ${error}`),
 * };
 */
interface AgentParams extends AllCallbacks {
    name?: string;
    lm: LmProvider,
}

export {
    AgentParams,
}
