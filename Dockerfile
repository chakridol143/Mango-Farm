FROM node:20-alpine AS build

WORKDIR /app

COPY mango-farm-backend/package*.json ./
RUN npm ci

COPY mango-farm-backend/tsconfig.json ./
COPY mango-farm-backend/bootstrap.js ./
COPY mango-farm-backend/src ./src
COPY mango-farm-backend/assets ./assets

RUN npm run build

FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY mango-farm-backend/package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/bootstrap.js ./bootstrap.js
COPY --from=build /app/dist ./dist
COPY --from=build /app/assets ./assets

EXPOSE 5000

CMD ["npm", "run", "start"]
