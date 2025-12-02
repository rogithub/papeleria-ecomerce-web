import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';

export const apiUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  
  if (isPlatformServer(platformId)) {
    // Solo interceptar URLs relativas que empiecen con /api
    if (req.url.startsWith('/api')) {
      const apiInternalUrl = process.env['API_INTERNAL_URL'] || 'http://localhost:5144';
      const newUrl = `${apiInternalUrl}${req.url}`;
      const clonedRequest = req.clone({ url: newUrl });
      return next(clonedRequest);
    }
  }
  
  return next(req);
};