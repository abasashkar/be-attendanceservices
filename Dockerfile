FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3001

RUN npx prisma generate

CMD ["sh", "-c", "npx prisma db push && npm start"]