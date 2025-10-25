FROM golang:1.25-alpine AS build
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o server ./cmd/api

FROM alpine:latest
WORKDIR /app
COPY --from=build /app/server /app/server
ENV PORT=4000
EXPOSE 4000
CMD ["/app/server"]