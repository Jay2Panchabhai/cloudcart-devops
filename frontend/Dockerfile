FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci && chmod +x node_modules/.bin/vite

COPY . .

ARG VITE_USER_API
ARG VITE_PRODUCT_API
ARG VITE_CART_API
ARG VITE_ORDER_API

ENV VITE_USER_API=${VITE_USER_API}
ENV VITE_PRODUCT_API=${VITE_PRODUCT_API}
ENV VITE_CART_API=${VITE_CART_API}
ENV VITE_ORDER_API=${VITE_ORDER_API}

RUN npm run build


FROM nginx:1.25-alpine AS production

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]