# syntax=docker/dockerfile:1

# Bun version
ARG BUN_VERSION=1.3.2

# Base image with Bun
FROM oven/bun:${BUN_VERSION} AS base
WORKDIR /app

# Install dependencies only (for caching)
FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Build stage - compile CSS
FROM deps AS build
COPY . .
RUN bun run build:css

# Production image
FROM base AS release

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application code
COPY package.json bun.lock ./
COPY index.ts ./
COPY app.css ./
COPY src ./src
COPY public ./public

# Copy built CSS from build stage
COPY --from=build /app/public/output.css ./public/output.css

# Set production environment
ENV NODE_ENV=production

# Expose the port
EXPOSE 3000

# Run the application
USER bun
CMD ["bun", "run", "index.ts"]
