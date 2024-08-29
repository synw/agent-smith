import { InferenceParams, ModelConf } from "@locallm/types";
import { TurnBlock } from "modprompt";

/**
 * Represents a template specification for a language model task.
 *
 * @interface TemplateSpec
 * @param {string} name - The name of the template.
 * @param {string} [system] - The system message for the template.
 * @param {Array<string>} [stop] - The stop sequences for the template.
 * @param {string} [assistant] - The assistant message for the template.
 */
interface TemplateSpec {
  name: string;
  system?: string;
  stop?: Array<string>;
  assistant?: string;
}

/**
 * Represents a language model task.
 *
 * @interface LmTask
 * @param {string} name - The name of the task.
 * @param {string} description - The description of the task.
 * @param {string} prompt - The prompt for the task.
 * @param {TemplateSpec} template - The template specification for the task.
 * @param {InferenceParams} inferParams - The inference parameters for the task.
 * @param {ModelConf} model - The model configuration for the task.
 * @param {Array<TurnBlock>} shots - The dialogue turns for the task.
 * @param {{ required?: Array<string>, optional?: Array<string> }} [variables] - The variables for the task.
 */
interface LmTask {
  name: string;
  description: string;
  prompt: string;
  template: TemplateSpec;
  inferParams: InferenceParams;
  model: ModelConf;
  shots: Array<TurnBlock>;
  variables?: { required?: Array<string>, optional?: Array<string> };
}

export { LmTask, TemplateSpec };

