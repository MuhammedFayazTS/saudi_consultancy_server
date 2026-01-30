# ---------- Base ----------
FROM node:24-alpine AS base
WORKDIR /app

# Enable pnpm via corepack (comes with Node 24)
RUN corepack enable && corepack prepare pnpm@latest --activate

# ---------- Dependencies ----------
FROM base AS deps

# Copy only dependency files for better caching
COPY package.json pnpm-lock.yaml* ./

# Install dependencies (including dev deps for build)
RUN pnpm install --frozen-lockfile

# ---------- Build ----------
FROM deps AS build

# Copy source code
COPY . .

# Build TypeScript
RUN pnpm run build

# ---------- Production ----------
FROM node:24-alpine AS runner
WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

ENV NODE_ENV=production

# Copy only production dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./

# Copy built output
COPY --from=build /app/dist ./dist

# Expose your app port (change if different)
EXPOSE 3500

# Start the app
CMD ["node", "dist/index.js"]


