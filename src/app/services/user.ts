import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAuthSuccessResponse } from '../models/auth-success-response';
import { ILoginSuccessResponse } from '../models/login-success-response';

// 🔧 Centralize o endereço base da API
const PORTAL_API = 'https://gapback-production.up.railway.app';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);

  /**
   * Valida se o usuário está autenticado
   */
  validateUser(): Observable<IAuthSuccessResponse> {
    return this.http.get<IAuthSuccessResponse>(`${PORTAL_API}/protected`);
  }

  /**
   * Realiza o login do usuário
   * @param login - Nome de usuário
   * @param password - Senha
   */
  login(payload: any): Observable<ILoginSuccessResponse> {    
    return this.http.post<ILoginSuccessResponse>(`${PORTAL_API}/signin`, payload);
  }
}
