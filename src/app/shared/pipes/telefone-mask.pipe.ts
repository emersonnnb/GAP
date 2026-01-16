import { Pipe, PipeTransform } from '@angular/core';
import { TelefoneMaskSemDDI } from '@app/shared/masks/telefone.mask';

@Pipe({
  name: 'telefoneMask',
  standalone: true,
})
export class TelefoneMaskPipe implements PipeTransform {
  transform(valor?: string | null): string {
    if (!valor) return '-';
    const numeros = valor.replace(/\D/g, '');
    if (numeros.length === 11) {
      return numeros.replace(/(\d{2})(\d)(\d{4})(\d{4})/, '($1) $2 $3-$4');
    }
    if (numeros.length === 10) {
      return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return valor;
  }
}
