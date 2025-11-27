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

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.cargando = true;
    this.productoService.obtenerProductos(1, 30).subscribe({
      next: (data) => {
        this.productos = data;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los productos';
        this.cargando = false;
        console.error('Error:', err);
      }
    });
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