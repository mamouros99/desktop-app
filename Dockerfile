#develop stage
FROM node:latest as develop-stage
WORKDIR /app
COPY package*.json ./
RUN npm i -g @quasar/cli
COPY . .

# build stage

FROM develop-stage as build-stage
RUN npm install
ARG VUE_APP_ENV_FILE
RUN quasar build

# prod stage
FROM nginx as production-stage
COPY --from=build-stage /app/dist/spa /usr/share/nginx/html
EXPOSE 8081
CMD ["nginx","-g", "daemon off;"]
