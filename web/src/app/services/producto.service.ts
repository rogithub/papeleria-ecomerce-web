import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto, ProductosPaginados } from '../models/producto.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private http = inject(HttpClient);
  private apiUrl: string = `${environment.apiUrl}/productos`;

  obtenerProductos(
    pagina: number = 1, 
    items: number = 30
  ): Observable<ProductosPaginados> {
    const params = new HttpParams()
      .set('pagina', pagina.toString())
      .set('items', items.toString());

    return this.http.get<ProductosPaginados>(this.apiUrl, { params });
  }
}