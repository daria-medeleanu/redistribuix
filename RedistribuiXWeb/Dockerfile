# Build stage
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
COPY vite.config.js ./
RUN npm install

COPY . .
RUN npm run build

# Production stage (serve built app with a simple static server)
FROM nginx:alpine AS final
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
