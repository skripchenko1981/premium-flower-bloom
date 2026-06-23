FROM nginx:stable-alpine

RUN apk add --no-cache openssl

# Create SSL directory and generate self-signed certificate
RUN mkdir -p /etc/nginx/ssl && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/key.pem \
    -out /etc/nginx/ssl/cert.pem \
    -subj "/C=UA/ST=Kyiv/L=Kyiv/O=FlowerShop/CN=flower-shop.local"

COPY nginx.conf /etc/nginx/nginx.conf

RUN mkdir -p /var/log/nginx

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget -qO- http://localhost:80/ || exit 1

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
