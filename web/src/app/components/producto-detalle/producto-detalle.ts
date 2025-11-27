import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/producto.service';
import { DetalleProducto } from '../../models/detalleProducto'; // Ajusta la ruta

@Component({
  selector: 'app-producto-detalle',
  imports: [CommonModule],
  templateUrl: './producto-detalle.html',
  styleUrl: './producto-detalle.scss'
})
export class ProductoDetalleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productoService = inject(ProductoService);

  producto?: DetalleProducto;
  cargando = true;
  error = '';
  fotoPrincipal = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarProducto(Number(id));
    }
  }

  cargarProducto(id: number): void {
    this.cargando = true;
    this.productoService.obtenerProductoPorId(id).subscribe({
      next: (data) => {
        this.producto = data;
        this.fotoPrincipal = data.fotos?.[0] || this.obtenerUrlFotoPlaceholder();
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar el producto';
        this.cargando = false;
        console.error('Error:', err);
      }
    });
  }

  cambiarFotoPrincipal(foto: string): void {
    this.fotoPrincipal = foto;
  }

  obtenerUrlFotoPlaceholder(): string {
    return 'https://via.placeholder.com/600x400?text=Sin+Imagen';
  }

  obtenerUrlFoto(foto: string): string {
    return foto; // Ya viene la URL completa de MinIO
  }

  formatearPrecio(precio: number): string {
    return precio.toFixed(2);
  }

  volverALista(): void {
    this.router.navigate(['/productos']);
  }
}