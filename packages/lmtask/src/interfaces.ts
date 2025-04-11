import { LmExpert } from "@agent-smith/brain";
import { InferenceParams, InferenceResult } from "@locallm/types";
import { TurnBlock, ToolSpec } from "modprompt";

interface ModelSpec {
  name: string;
  template: string;
  ctx?: number;
  system?: string;
  assistant?: string;
  inferParams?: InferenceParams;
}

/**
 * Represents the input configuration for a language model task.
 *
 * @interface LmTaskInput
 * @param {string} prompt - The user's input prompt for the task.
 * @param {Record<string, ModelSpec>} [models] - Optional record of model specifications by name.
 */
interface LmTaskInput {
  prompt: string;
  models?: Record<string, ModelSpec>;
  [key: string]: any;
}

/**
 * Configuration interface for a language model task.
 *
 * @interface LmTaskConf
 * @param {LmExpert<T>} [expert] - Optional expert system for the task.
 * @param {ModelSpec} [model] - Optional model configuration.
 * @param {InferenceParams} [inferParams] - Optional inference parameters.
 * @param {string} [modelname] - Optional modelname parameter.
 * @param {boolean} [debug] - Optional debug flag.
 */
interface LmTaskConf<T extends Record<string, any> = Record<string, any>> {
  expert?: LmExpert<T>;
  model?: ModelSpec;
  inferParams?: InferenceParams;
  modelname?: string;
  debug?: boolean;
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
  stop?: Array<string>;
  assistant?: string;
}

interface BaseLmTask {
  name: string;
  description: string;
  prompt: string;
  template?: TemplateSpec;
  inferParams?: InferenceParams;
  models?: Record<string, ModelSpec>;
  shots?: Array<TurnBlock>;
  variables?: { required?: Array<string>; optional?: Array<string> };
  tools?: Array<LmTaskToolSpec>;
  toolsList?: Array<string>;
}

/**
 * Represents a language model task configuration.
 *
 * @interface LmTask
 * @param {string} name - The name of the task.
 * @param {string} description - The description of the task.
 * @param {string} prompt - The input prompt for the task.
 * @param {ModelSpec} model - The primary model configuration.
 * @param {TemplateSpec} [template] - Optional template specification.
 * @param {InferenceParams} [inferParams] - Optional inference parameters.
 * @param {Record<string, ModelSpec>} [models] - Optional additional models by name.
 * @param {Array<TurnBlock>} [shots] - Optional dialogue examples for the task.
 * @param {{ required?: Array<string>, optional?: Array<string> }} [variables] - Task variables (required/optional).
 * @example
 * const task: LmTask = {
 *   name: "qa",
 *   description: "Answer questions",
 *   prompt: "Answer this question: {prompt}",
 *   model: { name: "mistral-nemo:latest", ctx: 16384, template: "mistral" },
 * };
 */
interface LmTask extends BaseLmTask {
  model: ModelSpec;
}

interface LmTaskToolSpec extends ToolSpec {
  execute: <O = any>(name: string, args: Record<string, any>) => Promise<O>;
}

interface LmTaskOutput {
  answer: InferenceResult;
  errors: Record<string, string>;
  toolUsed: string | null;
}

export {
  ModelSpec,
  LmTaskInput,
  BaseLmTask,
  LmTask,
  TemplateSpec,
  LmTaskConf,
  LmTaskToolSpec,
  LmTaskOutput
};
