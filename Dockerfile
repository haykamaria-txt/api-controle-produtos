FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./

RUN npm ci

COPY prisma ./prisma
COPY src ./src
COPY generated ./generated
COPY docs ./docs
COPY prisma.config.ts ./
COPY .env.example ./

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "start"]
