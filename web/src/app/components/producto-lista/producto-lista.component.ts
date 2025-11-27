import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-producto-lista',
  imports: [CommonModule],
  templateUrl: './producto-lista.component.html',
  styleUrl: './producto-lista.component.scss'
})
export class ProductoListaComponent implements OnInit {
  private productoService = inject(ProductoService);
  
  productos: Producto[] = [];
  cargando = true;
  error = '';

  // Variables para la paginación
  paginaActual = 1;
  totalPaginas = 0;
  totalProductos = 0;

  ngOnInit(): void {
    this.cargarProductos(1); // Empezar en página 1
  }

  cargarProductos(pagina: number): void {
    this.cargando = true;
    this.productoService.obtenerProductos(pagina, 30).subscribe({
      next: (data) => {
        this.productos = data.productos;
        this.paginaActual = data.paginacion.paginaActual;
        this.totalPaginas = data.paginacion.totalPaginas;
        this.totalProductos = data.paginacion.totalRows;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los productos';
        this.cargando = false;
        console.error('Error:', err);
      }
    });
  }

  cambiarPagina(nuevaPagina: number | string): void {
    const pagina = typeof nuevaPagina === 'string' ? parseInt(nuevaPagina) : nuevaPagina;
    
    // Validar que la página esté dentro del rango
    if (pagina < 1 || pagina > this.totalPaginas || pagina === this.paginaActual) {
      return;
    }
    
    this.cargarProductos(pagina);
    
    // Scroll suave al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  generarArrayPaginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  obtenerUrlFoto(foto: string | null): string {
    if (!foto) {
      return 'https://via.placeholder.com/300x225?text=Sin+Imagen';
    }
    return `https://cntnt.xplaya.com/papeleria-fotos-productos/${foto}`;
  }

  formatearPrecio(precio: number): string {
    return precio.toFixed(2);
  }
}