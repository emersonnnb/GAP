import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';

import { StringValidatorOptions } from '../model/validator.model';
import { ValidationMessages } from '../enums/messages.enum';
import { ContentMediaTypes } from '../enums/content-mediatypes.enum';


@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  /**
   * Remove a propriedade de um objeto de origem com base nos seguintes critérios:
   * - Campo nulo
   * - Campo vazio (com ou sem trim)
   * @param obj Objeto que será verificado
   * @returns Objeto sem campos nulos
   * @example
   * ```ts
   * removeNullFields({ nome: 'João', idade: null }) // { nome: 'João' }
   * ```
   * @memberof UtilsService
   */
  static removeNullFields(obj: any): any {
    return Object.keys(obj).reduce((result: any, key: string) => {
      const value = obj[key];
      if (
        value !== null &&
        !(typeof value === 'string' && value.trim() === '')
      ) {
        result[key] = obj[key];
      }
      return result;
    }, {});
  }

  /**
   * Adiciona validadores a um formControl de um FormGroup de acordo com o nome do formControl
   * @param names Array de strings com os nomes dos formControls
   * @param parentControl FormGroup pai dos formControls
   * @param validator Função de validação a ser adicionada
   * @example
   * ```ts
   * addValidatorsByNames(['name', 'email'], formGroup, Validators.required);
   * ```
   * @memberof UtilsService
   */
  addValidatorsByNames(
    names: string[],
    parentControl: FormGroup,
    validator: ValidatorFn | ValidatorFn[]
  ): void {
    names.forEach((name) => {
      const control = parentControl.get(name);
      if (control) {
        if (control instanceof FormControl) {
          control.addValidators(validator);
          control.updateValueAndValidity({ emitEvent: false });
        } else if (control instanceof FormGroup) {
          this.addValidatorsByNames(names, control, validator);
        }
      } else {
        throw new Error(
          `O formControl ${name} não foi encontrado no FormGroup`
        );
      }
    });
  }

  /**
   * Remove validadores de um formControl de um FormGroup de acordo com o nome do formControl
   * @param names Array de strings com os nomes dos formControls
   * @param parentControl FormGroup pai dos formControls
   * @param clearField Limpa o campo após remover os validadores
   * @example
   * ```ts
   * removeValidatorsByNames(['name', 'email'], formGroup);
   * ```
   * @memberof UtilsService
   */
  removeValidatorsByNames(
    names: string[],
    parentControl: FormGroup,
    clearField = false
  ) {
    names.forEach((name) => {
      const control = parentControl.get(name);

      if (control) {
        if (control instanceof FormControl) {
          control.clearValidators();
          if (clearField) {
            control.reset();
          }
          control.updateValueAndValidity();
        } else if (control instanceof FormGroup) {
          this.removeValidatorsByNames(names, control);
        }
      } else {
        throw new Error(
          `O formControl ${name} não foi encontrado no FormGroup`
        );
      }
    });
  }

  /**
   * Faz o download de um arquivo a partir de um URI em formato Blob.
   * O conteúdo do URI é convertido em um Blob, e um link temporário é criado
   * para iniciar o download do arquivo.
   *
   * @param uri String contendo o conteúdo do arquivo que será convertido em um Blob.
   * @param mimeType Tipo MIME do arquivo (por exemplo, 'application/json', 'text/csv', etc.).
   * @param fileName Nome do arquivo a ser baixado. O padrão é 'arquivo'.
   * @param documentInstance Instância do objeto `document` do navegador, usada para criar o link de download.
   *
   * @example
   * ```ts
   * downloadURI('conteúdo do arquivo', 'application/json', 'dados.json', document);
   * ```
   * @memberof UtilsService
   */
  downloadURI(
    uri: string,
    mimeType: ContentMediaTypes,
    fileName = 'arquivo',
    documentInstance: Document
  ) {
    const blob = new Blob([uri], { type: mimeType });
    const link = documentInstance.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    documentInstance.body.appendChild(link);
    link.click();
    documentInstance.body.removeChild(link);
  }

  /**
   * Realiza o download de um arquivo
   * @param blob Objeto Blob do arquivo
   * @param fileName Nome do arquivo
   * @memberof UtilsService
   */
  downloadFile(blob: Blob, fileName: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  /**
   * Insere em um formData propriedades de um objeto iterado
   * @param obj Objeto a ser iterado para ser inserido no formData
   * @param formData formData resultante
   * @returns formData com as propriedades do objeto
   * @memberof UtilsService
   */
  createFormData(obj: any, formData: FormData) {
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      formData.append(key, value);
    });
  }

  /**
   * Define o valor como nulo de um formControl de um FormGroup de acordo com o nome do formControl
   * @param names Array de strings com os nomes dos formControls
   * @param parentControl FormGroup pai dos formControls
   * @example
   * ```ts
   * setNullFields(['name', 'email'], formGroup);
   * ```
   * @memberof UtilsService
   */
  setNullFields(form: FormGroup, fields: string[]): void {
    fields.forEach((field) => {
      const control = form.get(field);
      if (control) {
        control.setValue(null);
      }
    });
  }

  /**
   * Este validador permite aplicar regras de:
   * - Comprimento mínimo (`minLength`)
   * - Comprimento máximo (`maxLength`)
   * - Bloqueio de valores compostos apenas por números
   * - Bloqueio de valores compostos apenas por caracteres especiais
   * - Permitir exclusivamente caracteres alfanuméricos (`onlyAlphanumeric`)
   * - Bloqueio de valores que contenham números
   * - Permitir apenas caracteres válidos para nomes próprios (`properName`)
   *
   * Caso nenhuma opção seja informada, o validador aplicará apenas a regra de
   * obrigatoriedade (não aceitar valor vazio).
   *
   * @param options Objeto de configuração do validador
   * @param options.minLength (opcional) Número mínimo de caracteres permitidos
   * @param options.maxLength (opcional) Número máximo de caracteres permitidos
   * @param options.disallowOnlyNumbers (opcional) Se `true`, impede que o valor contenha apenas números
   * @param options.disallowOnlySpecial (opcional) Se `true`, impede que o valor contenha apenas caracteres especiais
   * @param options.onlyAlphanumeric (opcional) Se `true`, permite apenas caracteres alfanuméricos (A-Z, a-z, 0-9)
   * @param options.disallowNumbers (opcional) Se `true`, impede que o valor contenha números
   * @param options.properName (opcional) Se `true`, permite apenas caracteres válidos para nomes próprios (Letras, acentos, espaços, apóstrofos e hífens)
   * @returns Função de validação (`ValidatorFn`) que pode ser utilizada em `FormControl`
   * @memberof UtilsService
   */
  stringValidator(options?: StringValidatorOptions): ValidatorFn {
    return (control: AbstractControl) => {
      const raw = control.value ?? '';
      const value = String(raw).trim();
      const fail = (msg: string) => ({ message: msg });

      if (!value) return null;

      if (options?.onlyNumbers && !/^\d+$/.test(value)) {
        return fail('O campo deve conter apenas números.');
      }

      if (options?.minLength && value.length < options.minLength)
        return fail(
          `O campo deve ter no mínimo ${options.minLength} caracteres.`
        );

      if (options?.maxLength && value.length > options.maxLength)
        return fail(
          `O campo deve ter no máximo ${options.maxLength} caracteres.`
        );

      if (options?.disallowOnlySpecial && /^[^a-zA-Z0-9]+$/.test(value))
        return fail(ValidationMessages.ONLY_SPECIAL_CHARACTERS);

      if (options?.disallowOnlyNumbers && /^\d+$/.test(value))
        return fail(ValidationMessages.ONLY_NUMBERS);

      if (options?.onlyAlphanumeric && !/^[a-zA-Z0-9]+$/.test(value))
        return fail('O campo deve conter apenas caracteres alfanuméricos.');

      if (options?.disallowNumbers && /\d/.test(value))
        return fail('O campo não pode conter números.');

      if (options?.properName && !/^[a-zA-Z\u00C0-\u00FF\s'-]+$/.test(value))
        return fail('O campo deve conter apenas texto.');

      return null;
    };
  }

  /**
   * Método que valida o CPF
   * @returns {ValidatorFn} Uma função que recebe um controle e retorna de forma síncrona um mapa de erros de validação se o controle for inválido, caso contrário, nulo
   * @memberof CommonService
   */
  public static isValidCpf(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const cpf = control.value;
      const strCPF = String(cpf || '').replace(/[^\d]/g, '');

      if (!strCPF) return null;

      if (strCPF.length !== 11) return { cpfNotValid: true };

      if (/^(\d)\1+$/.test(strCPF)) {
        return { cpfNotValid: true };
      }

      let sum = 0;
      for (let i = 0; i < 9; i++) sum += +strCPF[i] * (10 - i);
      let firstCheck = (sum * 10) % 11;
      if (firstCheck === 10 || firstCheck === 11) firstCheck = 0;
      if (firstCheck !== +strCPF[9]) return { cpfNotValid: true };

      sum = 0;
      for (let i = 0; i < 10; i++) sum += +strCPF[i] * (11 - i);
      let secondCheck = (sum * 10) % 11;
      if (secondCheck === 10 || secondCheck === 11) secondCheck = 0;
      if (secondCheck !== +strCPF[10]) return { cpfNotValid: true };

      return null;
    };
  }

  /**
   * Método que valida o CNPJ
   * @returns {ValidatorFn} Uma função que recebe um controle e retorna de forma síncrona um mapa de erros de validação se o controle for inválido, caso contrário, nulo
   * @memberof CommonService
   */
  public static isValidCnpj(): ValidatorFn {
    return (control: AbstractControl): Validators => {
      const checkCNPJ = (cnpj: string) => {
        if (!cnpj) {
          return false;
        }

        // Esta função retira os caracteres . / - da string do cnpj, deixando apenas os números
        const strCNPJ: string = String(cnpj).replace(/[^\d]/g, '');

        // Testa as sequencias que possuem todos os dígitos iguais e se o cnpj não tem 14 dígitos, retonando falso e exibindo uma msg de erro
        if (
          strCNPJ === '00000000000000' ||
          strCNPJ === '11111111111111' ||
          strCNPJ === '22222222222222' ||
          strCNPJ === '33333333333333' ||
          strCNPJ === '44444444444444' ||
          strCNPJ === '55555555555555' ||
          strCNPJ === '66666666666666' ||
          strCNPJ === '77777777777777' ||
          strCNPJ === '88888888888888' ||
          strCNPJ === '99999999999999' ||
          strCNPJ.length !== 14
        ) {
          return false;
        }

        // A variável numeros pega o bloco com os números sem o DV, a variavel digitos pega apenas os dois ultimos numeros (Digito Verificador).
        let tamanho = strCNPJ.length - 2;
        let numeros = strCNPJ.substring(0, tamanho);
        const digitos = strCNPJ.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;

        // Os quatro blocos seguintes de funções irá reaizar a validação do CNPJ propriamente dito, conferindo se o DV bate. Caso alguma das funções não consiga verificar
        // o DV corretamente, mostrará uma mensagem de erro ao usuário e retornará falso, para que o usário posso digitar novamente um número
        for (let i = tamanho; i >= 1; i--) {
          soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
          if (pos < 2) {
            pos = 9;
          }
        }

        let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
        if (resultado != parseInt(digitos.charAt(0))) {
          return false;
        }

        tamanho = tamanho + 1;
        numeros = strCNPJ.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (let k = tamanho; k >= 1; k--) {
          soma += parseInt(numeros.charAt(tamanho - k)) * pos--;
          if (pos < 2) {
            pos = 9;
          }
        }

        resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
        if (resultado != parseInt(digitos.charAt(1))) {
          return false;
        }

        return true;
      };

      if (checkCNPJ(control.value)) {
        return null as any;
      } else {
        return { cnpjNotValid: true };
      }
    };
  }

  /**
   * Valida CPF ou CNPJ no mesmo campo
   * Aceita se pelo menos um dos dois for válido
   */
  public static cpfOrCnpjValidator(): ValidatorFn {
    const cpfValidator = UtilsService.isValidCpf();
    const cnpjValidator = UtilsService.isValidCnpj();

    return (control: AbstractControl): ValidationErrors | null => {
      const value = (control.value || '').replace(/[^\d]/g, '');

      if (!value) return null; // deixa o Validators.required tratar campo vazio

      // CPF → 11 dígitos
      if (value.length === 11) {
        const result = cpfValidator(control);
        return result;
      }

      // CNPJ → 14 dígitos
      if (value.length === 14) {
        const result = cnpjValidator(control);
        return result;
      }

      // Nem CPF nem CNPJ → inválido
      return { cpfCnpjInvalidLength: true };
    };
  }

  /**
   * Método que valida o e-mail
   * @returns {ValidatorFn} Uma função que recebe um controle e retorna de forma síncrona um mapa de erros de validação se o controle for inválido, caso contrário, nulo
   * @memberof CommonService
   */
  public static isValidEmail(): ValidatorFn {
    return (control: AbstractControl): Validators => {
      const checkTextError = (texto: string) => {
        if (!texto) return false;

        const patternEmailValid =
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!patternEmailValid.test(texto))
          return ValidationMessages.INVALID_EMAIL;

        return false;
      };

      const error = checkTextError(control.value);
      if (!error) {
        return null as any;
      } else {
        return { invalidEmail: error };
      }
    };
  }
}
