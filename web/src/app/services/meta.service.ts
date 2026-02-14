import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';


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
  private document = inject(DOCUMENT);

  // Configuración por defecto
  private defaultConfig: MetaTagsConfig = {
    title: 'Papelería',
    description: 'Papelería y Mercería El Gordo',
    image: '/img/logocircle.png',
    url: 'https://xplaya.com',
    type: 'website',
    siteName: 'Papelería'
  };

  constructor() {}

  /**
   * Agrega o actualiza el script JSON-LD para productos
   */
  updateProductSchema(producto: {
    nombre: string;
    precio: number;
    categoria: string;
    fotoPrincipalUrl: string;
    id: number;
    stock: number;
  }): void {
    const head = this.document.getElementsByTagName('head')[0];
    
    // Remover script anterior si existe
    const existingScript = this.document.getElementById('product-schema');
    if (existingScript) {
      existingScript.remove();
    }
    // Crear nuevo script
    const script = this.document.createElement('script');
    script.id = 'product-schema';
    script.type = 'application/ld+json';
    
    const currentYear = new Date().getFullYear();
    const priceValidUntil = `${currentYear}-12-31`;

    const schema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "url": `${this.defaultConfig.url}/productos/${producto.id}`,
      "name": producto.nombre,
      "description": `$${producto.precio.toFixed(2)} | ${producto.categoria}`,
      "image": producto.fotoPrincipalUrl,
      "sku": `nid${producto.id}`,
      "brand": {
        "@type": "Brand",
        "name": "Papelería y Mercería El Gordo"
      },
      "offers": {
        "@type": "Offer",
        "url": `${this.defaultConfig.url}/productos/${producto.id}`,
        "price": producto.precio.toFixed(2),
        "priceCurrency": "MXN",
        "priceValidUntil": priceValidUntil,
        "availability": producto.stock > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
        "inventoryLevel": {
          "@type": "QuantitativeValue",
          "value": producto.stock
        }
      }
    };
    script.text = JSON.stringify(schema);
    head.appendChild(script);
  }

  /**
   * Agrega o actualiza el schema BreadcrumbList para navegación
   */
  updateBreadcrumbSchema(producto: {
    nombre: string;
    categoria: string;
    id: number;
  }): void {
    const head = this.document.getElementsByTagName('head')[0];

    const existingScript = this.document.getElementById('breadcrumb-schema');
    if (existingScript) {
      existingScript.remove();
    }

    const script = this.document.createElement('script');
    script.id = 'breadcrumb-schema';
    script.type = 'application/ld+json';

    const schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Inicio",
          "item": this.defaultConfig.url
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": producto.categoria,
          "item": `${this.defaultConfig.url}/productos?busqueda=${encodeURIComponent(producto.categoria)}`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": producto.nombre
        }
      ]
    };

    script.text = JSON.stringify(schema);
    head.appendChild(script);
  }

  /**
   * Actualiza el canonical link
   */
  updateCanonical(url: string): void {
    const head = this.document.getElementsByTagName('head')[0];
    let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');
    
    if (link) {
      link.setAttribute('href', url);
    } else {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', url);
      head.appendChild(link);
    }
  }

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

    const productSchema = this.document.getElementById('product-schema');
    if (productSchema) productSchema.remove();

    const breadcrumbSchema = this.document.getElementById('breadcrumb-schema');
    if (breadcrumbSchema) breadcrumbSchema.remove();
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
    fotoPrincipalUrl: string;
    id: number;
    stock: number;
  }): void {
    const productUrl = `${this.defaultConfig.url}/productos/${producto.id}`;
    
    const config: MetaTagsConfig = {
      title: producto.nombre,
      description: `$${producto.precio.toFixed(2)} | ${producto.categoria}`,
      image:  producto.fotoPrincipalUrl,
      url: productUrl,
      type: 'product'
    };

    this.updateTags(config);
    this.updateCanonical(productUrl);
    this.updateProductSchema(producto);
    this.updateBreadcrumbSchema(producto);
  }
}