FROM node:20.11.1 as build
WORKDIR /usr/app
COPY . /usr/app/
RUN npm ci
RUN npm run build

FROM nginx:1.25.4
EXPOSE 80
COPY ./docker/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/app/dist /usr/share/nginx/html