import type { InferenceParams, InferenceResult, InferenceOptions, ToolSpec, HistoryTurn, ToolCallSpec } from "@locallm/types";
import type { PromptTemplate } from "modprompt";

interface ModelSpec {
    name: string;
    template?: string;
    ctx?: number;
    system?: string;
    afterSystem?: string;
    assistant?: string;
    inferParams?: InferenceParams;
}

/**
 * Represents the input configuration for a language model task.
 *
 * @interface TaskInput
 * @param {string} prompt - The user's input prompt for the task.
 */
interface TaskInput {
    prompt: string;
    [key: string]: any;
}

/**
 * Configuration interface for a language model task.
 *
 * @interface TaskConf
 * @param {ModelSpec} [model] - Optional model configuration.
 * @param {InferenceParams} [inferParams] - Optional inference parameters.
 * @param {boolean} [debug] - Optional debug flag.
 * @param {boolean} [quiet] - Optional quiet flag.
 */
interface TaskConf {
    model?: ModelSpec;
    inferParams?: InferenceParams;
    options?: InferenceOptions;
    debug?: boolean;
    verbose?: boolean;
    baseDir?: string;
    onToolCall?: (tc: ToolCallSpec) => void;
    onToolCallEnd?: (tr: any) => void;
}

/**
 * Represents a template specification for a language model task.
 *
 * @interface TemplateSpec
 * @param {string} [system] - The system message for the template.
 * @param {Array<string>} [stop] - Extra stop sequences for the template.
 * @param {string} [assistant] - The assistant start message for the template.
 * @example
 * const template: TemplateSpec = {
 *   system: "You are a helpful AI",
 *   stop: ["\n", "</s>"],
 * };
 */
interface TemplateSpec {
    system?: string;
    afterSystem?: string;
    stop?: Array<string>;
    assistant?: string;
}

interface TaskVariableDef {
    type: string | Array<string>; // array is for enums
    description: string;
}

interface TaskOptionalVariableDef extends TaskVariableDef {
    default?: any
}

interface TaskVariables {
    required?: Record<string, TaskVariableDef>;
    optional?: Record<string, TaskOptionalVariableDef>;
}

interface TaskDef {
    name: string;
    prompt: string;
    description: string;
    model: ModelSpec;
    ctx: number;
    template?: TemplateSpec;
    inferParams?: InferenceParams;
    models?: Record<string, ModelSpec>;
    shots?: Array<HistoryTurn>;
    variables?: TaskVariables;
    tools?: Array<ToolSpec>;
    toolsList?: Array<string>;
}

interface TaskOutput {
    answer: InferenceResult;
    template: PromptTemplate;
}

export {
    ModelSpec,
    TaskInput,
    TaskDef,
    TemplateSpec,
    TaskConf,
    TaskOutput,
    TaskVariableDef,
    TaskOptionalVariableDef,
    TaskVariables,
};
