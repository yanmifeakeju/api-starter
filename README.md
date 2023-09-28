# NODEJS API STARTER

A starter template for me to build Node Backend API

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Folder Structure](#folder-structure)
- [Configuration](#configuration)

## Overview

**API STARTER** provides me a starting base for writing Backend APIs. It is my intention that this approach will make it easy to add changes and functionalities.

### Technologies Used

- [Fastify](https://fastify.dev/)
- [BullMQ](https://docs.bullmq.io/)
- Postgres with [atdatabases](https://www.atdatabases.org/)
- [MongoDB](https://www.mongodb.com/docs/drivers/node/current)
- [Vitest](https://vitest.dev/) (Test Runner)
- Docker (and [Dockerode](https://www.npmjs.com/package/dockerode))
- [Fly](https://fly.io/) (Deployment)
- [Dprint](https://dprint.dev/plugins/typescript/) (Formatter)

## Getting Started

To get started with API STARTER, follow these steps:

1. [Install PNPM](https://pnpm.io/installation) if you haven't already.
2. Have [Docker](https://docs.docker.com/get-docker/) installed on your machine
3. Run `pnpm install` to install project dependencies.
4. Refer to the [Configuration](#configuration) for information on env vars.
   - `cp .env.example .env`
5. Start the API:
   - For local development: `pnpm start:api:local`
   - Using Docker Compose: `docker compose up`

## Folder Structure

Here's an overview of our project's folder structure and the purpose of each major directory:

- `apps/`: The directory serves as the core of the backend application, housing both the HTTP API layer and background worker processes. This directory encapsulates the main functionality and endpoints.

- `config/`: The config directory serves as a centralized location for managing various configurations and utilities needed throughout the application. It contains subdirectories and files tailored to specific purposes, making it easier to organize and access essential settings.

- `core/`: The `core/` holds core logic related to current problem domain. It defines data structures, functionality for each model represented within the system. Eg. users, transactions, wallets.

- `infrastructure/`: This stores infrastructure-related stuff, such as database connections, etc.

- `queues/`: The `queues/` directory is dedicated to queue management and background processing. Job queues and their workers are here. It utilizes BullMQ.

- `services/`: This directory contains service modules that encapsulate specific business logic. Services handle tasks like user authentication, onboarding.

- `shared/`: In `shared/`, you'll find code and modules that are shared across different parts of the API. Stuff like common utilities, constants, and shared data structures belong here.

- `@types/`: The `@types/` directory stores TypeScript type definitions and declarations.

- `utils/`: The `utils/` directory is home to utility functions and helper modules that are used throughout the codebase.

## Configuration

Running `docker compose up` should work with the default environment variables in `.env.example`:

- `DATABASE_URL`: The URL for the PostgreSQL database.
- `SERVER_PORT`: The port on which the server will run.
- `NODE_ENV`: The current environment (e.g., `development`, `production`).
- `AUTH_JWT_SECRET`: The secret key for JWT authentication.
- `JWT_EXPIRES_IN`: The expiration time for JWT tokens.
- `RESEND_API_KEY`: API key for a resend service (required but doesn't matter).
- `REDIS_URL`: The URL for the Redis server.
- `MONGO_URI`: The URI for connecting to MongoDB.
- `MONGO_STORE`: The MongoDB database name.
