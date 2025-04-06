FROM node:22-alpine

WORKDIR /apps/ws-backend

RUN npm install -g pnpm@9.0.0

# Copy only package files first
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Copy the rest of the app
COPY . .

RUN pnpm run db:generate

EXPOSE 8000

CMD ["node", "apps/ws-backend/dist/index.js"]