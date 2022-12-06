# syntax=docker/dockerfile:1
FROM node:16-alpine as builder
WORKDIR /app
COPY . .
RUN apk add --no-cache git g++ make
RUN yarn install
