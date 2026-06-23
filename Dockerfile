FROM node:20-alpine AS builder

WORKDIR /app

ARG VITE_API_URL=/

COPY package.json bun.lock ./
RUN npm install -g bun && bun install --frozen-lockfile

COPY . .
RUN VITE_API_URL=${VITE_API_URL} bun run build


FROM nginx:stable-alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost:80/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
