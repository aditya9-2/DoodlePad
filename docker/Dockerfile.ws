FROM node:22-alpine

WORKDIR /apps/ws-backend

RUN npm install -g pnpm@9.0.0

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./

RUN pnpm install

RUN pnpm run db:migrate

COPY . .

RUN pnpm build --filter=ws-backend

EXPOSE 8080

CMD ["node", "apps/ws-backend/dist/index.js"]
