import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CartStatus } from '../cart-status/cart-status';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, CartStatus],
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss']
})
export class LayoutComponent { }