import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cpfMask',
  standalone: true,
})
export class CpfMaskPipe implements PipeTransform {

  transform(valor?: string | null): string {
    if (!valor) return '-';

    const numeros = valor.replace(/\D/g, '');

    if (numeros.length !== 11) {
      return valor; // fallback caso não tenha 11 dígitos
    }

    return numeros.replace(
      /(\d{3})(\d{3})(\d{3})(\d{2})/,
      '$1.$2.$3-$4'
    );
  }
}
