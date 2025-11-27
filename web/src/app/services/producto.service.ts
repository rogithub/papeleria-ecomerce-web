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
    items: number = 30,
    search: string = ''  // Nuevo parámetro opcional
  ): Observable<ProductosPaginados> {
    let params = new HttpParams()
      .set('pagina', pagina.toString())
      .set('items', items.toString());

    // Agregar parámetro de búsqueda si existe
    if (search && search.trim() !== '') {
      params = params.set('search', search.trim());
    }
    return this.http.get<ProductosPaginados>(this.apiUrl, { params });
  }
}