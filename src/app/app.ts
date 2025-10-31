import { Component, signal } from '@angular/core';
import { Product, ProductCard } from './components/product-card/product-card';


@Component({
  selector: 'app-root',
  imports: [ProductCard],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('web');
  // Datos de ejemplo - TEMPORAL
  exampleProduct: Product = {
    id: 1,
    name: 'Cuaderno Profesional',
    price: 45.50,
    imageUrl: 'https://via.placeholder.com/200'
  };
}
