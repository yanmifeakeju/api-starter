FROM node:18.17.1-bullseye-slim as base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /src
COPY package.json pnpm-lock.*  tsconfig.*  ./


FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build


FROM base AS dev
COPY --from=build /src .
RUN ls
CMD [ "pnpm", "start:api" ]


FROM base as prod
COPY --from=prod-deps /src/node_modules .
COPY --from=build /src/dist ./dist
COPY . .
CMD [ "pnpm", "start:api" ]








