# ----------------------------
# 🧱 Stage 1: Build Dependencies
# ----------------------------
FROM node:20-bullseye AS builder

WORKDIR /usr/src/app
COPY package*.json pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm install

COPY . .
RUN pnpm build

# ----------------------------
# 🐋 Stage 2: Runtime
# ----------------------------
FROM node:20-bullseye

# Install Solana CLI + Anchor
RUN apt-get update && apt-get install -y libudev-dev pkg-config build-essential curl git
RUN sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
RUN cargo install --git https://github.com/coral-xyz/anchor avm --locked

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app ./

ENV NODE_ENV=production
EXPOSE 3000 4000

CMD ["pnpm", "dev"]
