import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CepModel } from '@app/models/gestao.model';

@Injectable({ providedIn: 'root' })
export class Domains {
  private http = inject(HttpClient);

  protected domain = 'https://brasilapi.com.br/api';
  protected entity = 'cep/v1';

  private get baseUrl(): string {
    return `${this.domain}/${this.entity}`;
  }

  getCep(cep: string): Observable<CepModel | null> {
    const onlyDigits = (cep ?? '').replace(/\D/g, '');

    if (onlyDigits.length !== 8) {
      return of(null);
    }

    return this.http
      .get<CepModel>(`${this.baseUrl}/${onlyDigits}`)
      .pipe(catchError(() => of(null)));
  }
}
