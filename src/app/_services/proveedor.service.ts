import { Message } from './../_model/message';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Backend } from './../_constantes/backend';
import { Injectable } from '@angular/core';
import { Proveedor } from '../_model/proveedor';

@Injectable()
export class ProveedorService {
  private backend = new Backend('');
  private URL_API = `${this.backend.URL_BACKEND}/api/proveedores`;

  constructor(private client: HttpClient) {}

  addProveedor(proveedor: Proveedor): Observable<Proveedor> {
    return this.client.post<Proveedor>(this.URL_API, proveedor);
  }
  updateProveedor(proveedor: Proveedor): Observable<Message> {
    return this.client.post<Message>(`${this.URL_API}/update`, proveedor);
  }
  deleteProveedor(proveedor: Proveedor): Observable<Message> {
    return this.client.post<Message>(`${this.URL_API}/delete`, proveedor);
  }
  getProveedor(): Observable<Proveedor[]> {
    return this.client.get<Proveedor[]>(this.URL_API);
  }
  getProveedorByCod(cod: string): Observable<Proveedor> {
    return this.client.get<Proveedor>(`${this.URL_API}/${cod}`);
  }
  getProveedoresByPrefix(cod: string): Observable<Proveedor[]> {
    return this.client.get<Proveedor[]>(`${this.URL_API}/prefix/${cod}`);
  }
}
