import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface MetaTagsConfig {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MetaService {
  private meta = inject(Meta);
  private titleService = inject(Title);

  // Configuración por defecto
  private defaultConfig: MetaTagsConfig = {
    title: 'Papelería',
    description: 'Papelería y Mercería - Playa del Carmen',
    image: '/img/logocircle.png',
    url: 'https://xplaya.com',
    type: 'website',
    siteName: 'Papelería'
  };

  constructor() {}

  /**
   * Actualiza todos los meta tags de la página
   */
  updateTags(config: MetaTagsConfig): void {
    const tags = { ...this.defaultConfig, ...config };

    // Actualizar título de la página
    if (tags.title) {
      this.titleService.setTitle(tags.title);
    }

    // Meta tags básicos
    this.updateTag('description', tags.description || '');
    
    // Open Graph tags (Facebook, LinkedIn, etc.)
    this.updateTag('og:title', tags.title || '', 'property');
    this.updateTag('og:description', tags.description || '', 'property');
    this.updateTag('og:image', this.getFullUrl(tags.image || ''), 'property');
    this.updateTag('og:url', tags.url || '', 'property');
    this.updateTag('og:type', tags.type || 'website', 'property');
    this.updateTag('og:site_name', tags.siteName || '', 'property');

    // Twitter Card tags
    this.updateTag('twitter:card', 'summary_large_image');
    this.updateTag('twitter:title', tags.title || '');
    this.updateTag('twitter:description', tags.description || '');
    this.updateTag('twitter:image', this.getFullUrl(tags.image || ''));

    // WhatsApp también usa Open Graph, pero podemos agregar algunos extras
    this.updateTag('og:image:width', '1200', 'property');
    this.updateTag('og:image:height', '630', 'property');
  }

  /**
   * Restaura los meta tags a los valores por defecto
   */
  resetTags(): void {
    this.updateTags(this.defaultConfig);
  }

  /**
   * Actualiza o crea un meta tag específico
   */
  private updateTag(name: string, content: string, attribute: 'name' | 'property' = 'name'): void {
    if (!content) return;

    const selector = `${attribute}="${name}"`;
    const tag = { [attribute]: name, content };

    // Si el tag existe, actualizarlo; si no, crearlo
    if (this.meta.getTag(selector)) {
      this.meta.updateTag(tag, selector);
    } else {
      this.meta.addTag(tag);
    }
  }

  /**
   * Convierte una URL relativa en absoluta
   */
  private getFullUrl(url: string): string {
    if (!url) return '';
    
    // Si ya es una URL absoluta, devolverla tal cual
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    // Si es una ruta relativa, construir URL completa
    const baseUrl = this.defaultConfig.url || '';
    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  }

  /**
   * Método helper para generar meta tags para productos
   */
  updateProductTags(producto: {
    nombre: string;
    precio: number;
    categoria: string;
    fotos?: string[];
    id: number;
  }): void {
    const config: MetaTagsConfig = {
      title: `${producto.nombre}`,
      description: `${producto.nombre} en categoría ${producto.categoria}. Precio: $${producto.precio.toFixed(2)}.`,
      image: producto.fotos && producto.fotos.length > 0 
        ? producto.fotos[0] 
        : '/img/logocircle.png',
      url: `${this.defaultConfig.url}/productos/${producto.id}`,
      type: 'product'
    };

    this.updateTags(config);
  }
}