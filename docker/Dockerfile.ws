FROM node:20-alpine


RUN npm install -g pnpm


WORKDIR /app

COPY . /app

RUN pnpm install


# Build only ws-backend and its deps
RUN pnpm exec turbo run build --filter=ws-backend...

EXPOSE 8080

CMD ["pnpm", "--filter", "ws-backend", "start"]
