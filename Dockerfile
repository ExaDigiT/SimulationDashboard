FROM node:20.11.1 as build
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm ci
COPY . /app/
ENV VITE_BASE_PATH=${VITE_BASE_PATH}
RUN npm run build

FROM bitnami/nginx:1.25.4
EXPOSE 8080
COPY ./docker/server.conf /opt/bitnami/nginx/conf/server_blocks/server.conf
COPY --from=build /app/dist /app
