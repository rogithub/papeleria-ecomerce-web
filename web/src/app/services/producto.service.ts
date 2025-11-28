import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto, ProductosPaginados } from '../models/producto.model';
import { environment } from '../../environments/environment';
import { DetalleProducto } from '../models/detalleProducto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private http = inject(HttpClient);
  private apiUrl: string = `${environment.apiUrl}/productos`;

  private ultimaPagina = 1;
  private ultimaBusqueda = '';

  obtenerProductos(
    pagina: number = 1, 
    items: number = 9,
    search: string = ''  // Nuevo parámetro opcional
  ): Observable<ProductosPaginados> {
    let params = new HttpParams()
      .set('pagina', pagina.toString())
      .set('rows', items.toString());

    // Agregar parámetro de búsqueda si existe
    if (search && search.trim() !== '') {
      params = params.set('search', search.trim());
    }
    return this.http.get<ProductosPaginados>(this.apiUrl, { params });
  }

  obtenerProductoPorId(id: number): Observable<DetalleProducto> {
    return this.http.get<DetalleProducto>(`${this.apiUrl}/${id}`);
  }

  // Guardar el estado actual
  guardarEstado(pagina: number, busqueda: string): void {
    this.ultimaPagina = pagina;
    this.ultimaBusqueda = busqueda;
  }

  // Obtener el estado guardado
  obtenerEstado(): { pagina: number, busqueda: string } {
    return {
      pagina: this.ultimaPagina,
      busqueda: this.ultimaBusqueda
    };
  }
}