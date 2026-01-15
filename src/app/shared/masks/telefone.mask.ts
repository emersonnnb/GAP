/**
 * Máscara do campo de texto para número de telefone
 * @defaultValue +99 (00) 0 0000-0000 || +99 (00) 0000-0000
 * @type {string}
 * @see {@link https://github.com/JsDaddy/ngx-mask/blob/develop/USAGE.md#specialcharacters-string- | Documentação ngx-mask}
 */
export const TelefoneMask = '+00 (00) 0 0000-0000||+00 (00) 0000-0000';

/**
 * Máscara do campo de texto para número de telefone sem DDI
 * @defaultValue (00) 0 0000-0000 || (00) 0000-0000
 * @type {string}
 * @see {@link https://github.com/JsDaddy/ngx-mask/blob/develop/USAGE.md#specialcharacters-string- | Documentação ngx-mask}
 */
export const TelefoneMaskSemDDI = '(00) 0 0000-0000||(00) 0000-0000';

/**
 * Expressão regular para validação do campo de texto para número de telefone
 * @defaultValue /^\+\d{2} \(\d{2}\) \d \d{4}-\d{4}$|^\+\d{2} \(\d{2}\) \d{4}-\d{4}$/
 * @type {RegExp}
 */
export const telefoneRegex =
  /^\+\d{2} \(\d{2}\) \d \d{4}-\d{4}$|^\+\d{2} \(\d{2}\) \d{4}-\d{4}$/;
