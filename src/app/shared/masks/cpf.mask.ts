/**
 * Máscara do campo de texto para número do CPF
 * @defaultValue 999.999.999-99
 * @type {string}
 * @see {@link https://github.com/JsDaddy/ngx-mask/blob/develop/USAGE.md#specialcharacters-string- | Documentação ngx-mask}
 */
export const CpfMask = '000.000.000-00';

/**
 * Expressão regular para validação do campo de texto para número do CPF
 * @defaultValue /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
 * @type {RegExp}
 */
export const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
