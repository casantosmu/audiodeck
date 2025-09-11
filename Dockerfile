FROM node:22-alpine AS frontend
WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY frontend/ ./
RUN pnpm build

FROM golang:1.25-alpine
WORKDIR /app

COPY backend/go.mod backend/go.sum ./
RUN go mod download

COPY backend/ ./
COPY --from=frontend /app/dist ./cmd/api/ui

RUN go build -ldflags='-s' -o ./bin/api ./cmd/api

EXPOSE 4000

CMD ["./bin/api", "-port", "4000", "-media-dir", "/media"]
