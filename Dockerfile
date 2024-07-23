FROM node:20.11.1 AS build
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm ci
COPY . /app/
RUN npm run build-prod

FROM bitnami/nginx:1.25.4
EXPOSE 8080
COPY ./docker/server.conf /opt/bitnami/nginx/conf/server_blocks/server.conf
COPY --from=build /app/dist /app
