FROM node:18.17.1-bullseye-slim AS base

# Meta
LABEL org.opencontainers.image.title="Node API Starter"

RUN  apt-get update \
  && apt-get install -y wget \
  && rm -rf /var/lib/apt/lists/
RUN wget https://github.com/Yelp/dumb-init/releases/download/v1.2.5/dumb-init_1.2.5_amd64.deb

RUN dpkg -i dumb-init_*.deb
ENTRYPOINT ["dumb-init"]

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN npm install -g npm@10.1.0

WORKDIR /usr/src/app
COPY package.json pnpm-lock.* tsconfig.* ./

FROM base as deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install -frozen-lockfile

FROM base as production-deps
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY package.json pnpm-lock.* tsconfig.* ./
RUN  pnpm fetch --prod

FROM base AS build
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
RUN echo "${X:-"{}"}" > ./dist/config/$NODE_ENV.env.json
RUN pnpm run build

FROM base AS dev
ENV NODE_ENV=development
COPY . .
CMD ["pnpm", "start:api:dev"]

FROM base AS prod
ENV NODE_ENV=production
EXPOSE 8080
COPY . .
COPY --from=production-deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/node_modules/@databases/pg-migrations ./node_modules/@databases/pg-migrations
COPY --from=build /usr/src/app/dist ./dist
RUN chown -R node /usr/src/app
USER node
CMD ["pnpm", "start:api"]
