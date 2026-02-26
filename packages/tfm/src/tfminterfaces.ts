/**
 * Interface for a template model.
 * This interface provides methods to guess a template from a model name
 * 
 * @remarks
 * This interface is used to manage templates for different models.
 * 
 * @property {() => string[]} list - A method to list all available templates.
 * @property {(model: string) => string} guess - A method to guess a template for a model.
 */
interface TemplateForModel {
    list: () => string[];
    guess: (model: string, tools?: boolean) => string;
}

export { TemplateForModel }