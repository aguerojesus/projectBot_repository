# Etapa de construcción
FROM node:18 as build

WORKDIR /orden-66

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa final para servir con nginx
FROM nginx:alpine

# Copiar archivos de la etapa de construcción
COPY --from=build /orden-66/dist /usr/share/nginx/html

# Exponer puerto
EXPOSE 80
