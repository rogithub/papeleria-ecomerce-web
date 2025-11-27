import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <div class="container-fluid">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .container-fluid {
      padding: 0;
    }
  `]
})
export class App { }