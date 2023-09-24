FROM node:18.17.1-bullseye-slim as base

# Meta
LABEL org.opencontainers.image.title="Node API Starter"

ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini
ENTRYPOINT ["/tini", "--"]

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /usr/src/app
COPY package.json pnpm-lock.*  tsconfig.*  ./

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build


FROM base AS dev
ENV NODE_ENV=development
COPY . .
CMD [ "pnpm", "start:api:dev" ]


FROM base as prod
ENV NODE_ENV=production
COPY --from=build /usr/src/app/dist ./dist
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile
RUN chown -R node /usr/src/app
USER node
CMD [ "pnpm", "start:api" ]








