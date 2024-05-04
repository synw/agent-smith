/**
 * Interface for a template model.
 * This interface provides methods to get, set, list, guess, findTemplate, and persistTemplate.
 * 
 * @remarks
 * This interface is used to manage templates for different models.
 * 
 * @property {(model: string) => Promise<string>} get - A method to get a template by model name.
 * @property {(template: string, model: string) => Promise<void>} set - A method to set a template for a model.
 * @property {() => string[]} list - A method to list all available templates.
 * @property {(model: string) => string} guess - A method to guess a template for a model.
 * @property {(modelName: string) => Promise<string>} findTemplate - A method to find a template by model name.
 * @property {(modelName: string, templ: string) => Promise<void>} persistTemplate - A method to persist a template for a model.
 */
interface TemplateForModel {
    get: (model: string) => Promise<string>;
    set: (template: string, model: string) => Promise<void>;
    list: () => string[];
    guess: (model: string) => string;
    findTemplate: (modelName: string) => Promise<string>;
    persistTemplate: (modelName: string, templ: string) => Promise<void>;
}

export { TemplateForModel }