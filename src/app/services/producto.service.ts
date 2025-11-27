import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5144/api/productos';

  obtenerProductos(
    pagina: number = 1, 
    items: number = 30
  ): Observable<Producto[]> {
    const params = new HttpParams()
      .set('pagina', pagina.toString())
      .set('items', items.toString());

    return this.http.get<Producto[]>(this.apiUrl, { params });
  }
}