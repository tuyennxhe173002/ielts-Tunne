FROM node:20-alpine AS base
WORKDIR /app

COPY package.json package-lock.json* ./
COPY apps/api/package.json ./apps/api/package.json
RUN npm install

COPY tsconfig.base.json ./
COPY prisma ./prisma
COPY apps/api ./apps/api

RUN npx prisma generate && npm run build:api

EXPOSE 4000

CMD ["npm", "--workspace", "apps/api", "run", "start:prod"]
