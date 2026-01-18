import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { UsuarioModel } from '@app/models/gestao.model';

@Injectable({
  providedIn: 'root'
})
export class GestaoUsuarioService {
  private http = inject(HttpClient);

  protected environment = environment;
  protected entity = `usuario`;

  private get baseUrl(): string {
    return `${this.environment.apiUrl}/${this.entity}`;
  }  

  getAllUsers(): Observable<UsuarioModel[]> {
    return this.http.get<UsuarioModel[]>(this.baseUrl);
  }

  getById(id: number): Observable<UsuarioModel> {
    return this.http.get<UsuarioModel>(`${this.baseUrl}/${id}`);
  }

  create(payload: Omit<UsuarioModel, 'id'>): Observable<UsuarioModel> {
    return this.http.post<UsuarioModel>(this.baseUrl, payload);
  }

  update(id: number, payload: UsuarioModel): Observable<UsuarioModel> {
    return this.http.put<UsuarioModel>(`${this.baseUrl}/${id}`, payload);
  }

  patch(id: number, payload: Partial<UsuarioModel>): Observable<UsuarioModel> {
    return this.http.patch<UsuarioModel>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
