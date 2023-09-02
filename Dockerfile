FROM node:18.17.1-bullseye-slim as base

LABEL org.opencontainers.image.title="Node API Starter"

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /usr/src/app
COPY package.json pnpm-lock.*  tsconfig.*  ./

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS dev
COPY --from=build /usr/src/app .
CMD [ "pnpm", "start:api:dev" ]


FROM base as prod
COPY --from=prod-deps /usr/src/app/node_modules .
COPY --from=build /usr/src/app/dist ./dist
COPY . .
RUN chown -R node /usr/src/app
USER node
CMD [ "pnpm", "start:api" ]








