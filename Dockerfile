FROM node:22-alpine AS frontend
WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY frontend/ ./
RUN pnpm build

FROM golang:1.25-alpine AS backend
WORKDIR /app

COPY backend/go.mod backend/go.sum ./
RUN go mod download

COPY backend/ ./
COPY --from=frontend /app/dist ./cmd/api/ui

RUN go build -ldflags='-s' -o ./bin/audiodeck ./cmd/api

FROM alpine:3.22
WORKDIR /app

RUN apk add --no-cache tzdata mailcap

COPY --from=backend /app ./

EXPOSE 4747

CMD ["./bin/audiodeck", "-port", "4747", "-media-dir", "/media"]
