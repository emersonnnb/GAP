/**
 * Máscara do campo de texto para CEP
 * @defaultValue 00000-000
 * @type {string}
 * @see {@link https://github.com/JsDaddy/ngx-mask/blob/develop/USAGE.md#specialcharacters-string- | Documentação ngx-mask}
 */
export const CepMask = '00000-000';

/**
 * Expressão regular para validação do campo de texto para CEP
 * @defaultValue /^\d{5}-\d{3}$/
 * @type {RegExp}
 */
export const cepRegex = /^\d{5}-\d{3}$/;
