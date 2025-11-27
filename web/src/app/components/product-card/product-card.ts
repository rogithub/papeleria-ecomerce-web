import { Component, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  @Input() product!: Product; // El ! significa "confía en mí, TypeScript"
}


// Esto es temporal - lo moveremos después
export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
}
