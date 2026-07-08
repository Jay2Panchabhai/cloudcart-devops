FROM node:20-alpine AS deps

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev


FROM node:20-alpine AS production

WORKDIR /app

RUN addgroup -S cloudcart && \
    adduser -S cloudcart -G cloudcart

COPY --from=deps /app/node_modules ./node_modules

COPY src/ ./src/

COPY package.json ./

RUN chown -R cloudcart:cloudcart /app

USER cloudcart

EXPOSE 3001

CMD ["node", "src/index.js"]