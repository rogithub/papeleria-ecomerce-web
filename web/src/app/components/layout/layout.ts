import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CartStatus } from '../cart-status/cart-status';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, CartStatus, CommonModule],
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss']
})
export class LayoutComponent {
  private userService = inject(UserService);
  readonly usuario$ = this.userService.usuario$;

  olvidarme(): void {
    this.userService.limpiar();
  }
}