import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '@app/models/gestao-usuario.model';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

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

  getAllUsers(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.baseUrl);
  }

  getById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/${id}`);
  }

  create(payload: Omit<Usuario, 'id'>): Observable<Usuario> {
    return this.http.post<Usuario>(this.baseUrl, payload);
  }

  update(id: number, payload: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.baseUrl}/${id}`, payload);
  }

  patch(id: number, payload: Partial<Usuario>): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
