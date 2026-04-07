# ---------- Base ----------
FROM node:24-alpine AS base
WORKDIR /app

# Enable pnpm via corepack (comes with Node 24)
RUN corepack enable && corepack prepare pnpm@latest --activate

# ---------- Dependencies (production only) ----------
FROM base AS prod-deps

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --prod --frozen-lockfile

# ---------- Dependencies (with dev for build) ----------
FROM base AS dev-deps

COPY package.json pnpm-lock.yaml* ./
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# ---------- Build ----------
FROM dev-deps AS build

COPY . .
RUN pnpm run build

# ---------- Production ----------
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy only production dependencies
COPY --from=prod-deps /app/node_modules ./node_modules
COPY package.json ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/src/docs ./src/docs

EXPOSE 3500

CMD ["node", "dist/index.js"]
