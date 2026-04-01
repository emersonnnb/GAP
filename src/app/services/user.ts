import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { IAuthSuccessResponse } from '../models/auth-success-response';
import { ILoginSuccessResponse } from '../models/login-success-response';

const PORTAL_API = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);

  validateUser(): Observable<IAuthSuccessResponse> {
    return this.http.get<IAuthSuccessResponse>(`${PORTAL_API}/protected`);
  }

  login(payload: { login: string; password: string }): Observable<ILoginSuccessResponse> {
    return this.http.post<ILoginSuccessResponse>(`${PORTAL_API}/signin`, payload);
  }
}
