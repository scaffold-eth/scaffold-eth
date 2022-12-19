# syntax=docker/dockerfile:1
FROM node:18-alpine as builder
WORKDIR /app
RUN apk add --no-cache git g++ make
RUN yarn install
COPY . .
