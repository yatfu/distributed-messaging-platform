FROM node:24-alpine AS build

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
COPY shared/ /app/shared/
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build


FROM nginx:alpine AS production

COPY --from=build /app/frontend/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
