import { Component, inject, OnInit } from '@angular/core';
import { MetaService } from '../../services/meta.service';

@Component({
  selector: 'app-resena',
  templateUrl: './resena.html',
  styleUrl: './resena.scss',
  standalone: true,
})
export class ResenaComponent implements OnInit {
  private metaSvc = inject(MetaService);

  readonly reviewUrl = 'https://search.google.com/local/writereview?placeid=ChIJVw8jFnxDTo8RnF2hE0foXRw';

  ngOnInit(): void {
    this.metaSvc.updateTags({
      title: '⭐ Déjanos tu reseña — Papelería El Gordo',
      description: '¿Te gustó nuestro servicio? Tu opinión nos ayuda a seguir mejorando. Déjanos una reseña en Google Maps.',
      image: 'https://xplaya.com/img/circleai.jpg',
      url: 'https://xplaya.com/resena',
      type: 'website',
    });
  }

  irAReseña(): void {
    window.open(this.reviewUrl, '_blank');
  }
}
