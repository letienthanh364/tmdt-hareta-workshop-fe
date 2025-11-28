FROM node:18-alpine as build_stage

WORKDIR /app

COPY . .

RUN yarn install
RUN yarn build

FROM nginx:1.17-alpine as production-stage
COPY --from=build_stage /app/dist /usr/share/nginx/html
RUN rm -v /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]