import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'cart-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-status.html',
  styleUrls: ['./cart-status.scss']
})
export class CartStatus implements OnInit {
  private cartService = inject(CartService);
  private router = inject(Router);
  private productoService = inject(ProductoService);
  
  totalItems = 0;
  ngOnInit(): void {
    // Nos suscribimos a los cambios en el carrito
    this.cartService.items$.subscribe(items => {
      // Calculamos el total de artículos sumando las cantidades de cada item
      this.totalItems = items.reduce((total, item) => total + item.cantidad, 0);
    });
  }
  
  verCarrito(): void {
    const estado = this.productoService.obtenerEstado();
    this.router.navigate(['/carrito'], {
      queryParams: {
        pagina: estado.pagina,
        busqueda: estado.busqueda || null
      }
    });
  }
}
