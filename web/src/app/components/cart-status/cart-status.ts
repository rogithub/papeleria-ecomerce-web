import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

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
  
  totalItems = 0;
  ngOnInit(): void {
    // Nos suscribimos a los cambios en el carrito
    this.cartService.items$.subscribe(items => {
      // Calculamos el total de artículos sumando las cantidades de cada item
      this.totalItems = items.reduce((total, item) => total + item.cantidad, 0);
    });
  }
  
  verCarrito(): void {
    this.router.navigate(['/carrito']);
  }
}
