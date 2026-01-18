import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { ClienteModel } from '@app/models/gestao.model';

@Injectable({
  providedIn: 'root'
})
export class GestaoClienteService {
  private http = inject(HttpClient);

  protected environment = environment;
  protected entity = `cliente`;

  private get baseUrl(): string {
    return `${this.environment.apiUrl}/${this.entity}`;
  }  

  getAllClientes(): Observable<ClienteModel[]> {
    return this.http.get<ClienteModel[]>(this.baseUrl);
  }

  getById(id: number): Observable<ClienteModel> {
    return this.http.get<ClienteModel>(`${this.baseUrl}/${id}`);
  }

  create(payload: Omit<ClienteModel, 'id'>): Observable<ClienteModel> {
    return this.http.post<ClienteModel>(this.baseUrl, payload);
  }

  update(id: number, payload: ClienteModel): Observable<ClienteModel> {
    return this.http.put<ClienteModel>(`${this.baseUrl}/${id}`, payload);
  }

  patch(id: number, payload: Partial<ClienteModel>): Observable<ClienteModel> {
    return this.http.patch<ClienteModel>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
