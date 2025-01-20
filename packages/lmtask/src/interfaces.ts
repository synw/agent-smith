import { InferenceParams } from "@locallm/types";
import { TurnBlock } from "modprompt";

interface ModelSpec {
  name: string
  ctx: number;
  template: string;
}

/**
 * Represents a template specification for a language model task.
 *
 * @interface TemplateSpec
 * @param {string} [system] - The system message for the template.
 * @param {Array<string>} [stop] - Extra stop sequences for the template.
 * @param {string} [assistant] - The assistant start message for the template.
 */
interface TemplateSpec {
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
  model: ModelSpec;
  template?: TemplateSpec;
  inferParams?: InferenceParams;
  models?: Record<string, ModelSpec>,
  shots?: Array<TurnBlock>;
  variables?: { required?: Array<string>, optional?: Array<string> };
}

//type ModelSize = "xsmall" | "small" | "medium" | "large" | "xlarge" | "xxlarge";

export {
  ModelSpec,
  //ModelSize,
  LmTask,
  TemplateSpec,
};

