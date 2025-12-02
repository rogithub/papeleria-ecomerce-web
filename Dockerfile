FROM node:24-alpine AS build
WORKDIR /usr/src/app

# Copiar package files e instalar dependencias
COPY web/package*.json ./
RUN npm ci

# Copiar código fuente y compilar SSR
COPY web/. .
RUN npm run build -- --configuration production

# Etapa final - Runtime
FROM node:24-alpine
WORKDIR /usr/src/app

# Copiar los archivos compilados del build
COPY --from=build /usr/src/app/dist/web /usr/src/app/dist/web

# Configurar variable de ambiente para la API interna del cluster
ENV API_INTERNAL_URL=http://api-inventario-service.api-inventario.svc.cluster.local:8080

# Exponer puerto 30512 (el que usa el servidor SSR)
EXPOSE 80

# Iniciar el servidor SSR
CMD ["node", "dist/web/server/server.mjs"]