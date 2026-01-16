import { Injectable } from '@angular/core';
import { Usuario } from '@app/models/gestao-usuario.model';
import { Observable, of } from 'rxjs';
import { USUARIOS_MOCK } from './mock';

@Injectable({
  providedIn: 'root'
})
export class GestaoUsuarioService {

  protected  module = `api`;
  protected entity = `usuario`;

  getAllUsers(): Observable<Usuario[]> {
    return of(USUARIOS_MOCK);
  }
}
