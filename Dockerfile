# --- Etapa 1: Compilación (Build Stage) ---
# Usamos una imagen oficial de Node.js (versión 20) para construir nuestro proyecto de Angular.
# La nombramos 'build' para poder referenciarla después.
FROM node:24 AS build

# Establecemos el directorio de trabajo dentro del contenedor.
WORKDIR /usr/src/app

# Copiamos el package.json y package-lock.json desde la subcarpeta correcta.
# Hacemos esto primero para aprovechar el cache de Docker.
COPY web/package*.json ./

# Usamos npm ci para una instalación limpia y rápida, ideal para CI/CD.
RUN npm ci

# Copiamos todo el resto del código fuente de la aplicación desde la subcarpeta.
COPY web/. .

# Ejecutamos el comando de build de Angular para producción.
# Esto generará los archivos estáticos optimizados en la carpeta /dist/web/browser.
RUN npm run build -- --configuration production

# --- Etapa 2: Imagen Final (Final Stage) ---
# Empezamos de cero con una imagen oficial de Nginx, súper ligera, basada en Alpine Linux.
FROM nginx:alpine

# Copiamos los archivos estáticos compilados desde la etapa 'build' a la carpeta
# donde Nginx sirve el contenido por defecto.
# Fíjate en la ruta de origen: /usr/src/app/dist/web/browser
COPY --from=build /usr/src/app/dist/web/browser /usr/share/nginx/html

## do not copy
##COPY nginx.conf /etc/nginx/conf.d/default.conf


# Exponemos el puerto 80, que es el puerto por defecto de Nginx.
EXPOSE 80

# El comando por defecto de la imagen de Nginx ya se encarga de iniciar el servidor,
# así que no necesitamos un ENTRYPOINT o CMD.