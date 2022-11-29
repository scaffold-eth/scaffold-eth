# syntax=docker/dockerfile:1
FROM node:16-alpine as builder
WORKDIR /app
COPY . .
RUN apk add --no-cache git g++ make
RUN yarn install
COPY wait-for-it.sh wait-for-it.sh 
RUN chmod +x wait-for-it.sh
