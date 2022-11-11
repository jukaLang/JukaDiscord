# syntax=docker/dockerfile:1

# specify the node base image with your desired version node:<version>
FROM node:16
# replace this with your application's default port
EXPOSE 8999

ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .

CMD [ "node", "index.js" ]