# Stage 1: build the static site
FROM node:22-alpine AS build
WORKDIR /app
ARG VITE_API_URL=http://localhost:8080
ENV VITE_API_URL=$VITE_API_URL
COPY package.json package-lock.json .npmrc ./
RUN npm ci
COPY . .
RUN npx vite build

# Stage 2: serve with nginx
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
