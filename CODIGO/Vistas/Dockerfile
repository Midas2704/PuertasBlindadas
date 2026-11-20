FROM node:25-bookworm-slim AS build

ARG VITE_MODO_DEMOSTRACION=false
ENV VITE_MODO_DEMOSTRACION=${VITE_MODO_DEMOSTRACION}

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
