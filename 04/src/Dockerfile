FROM node:alpine
WORKDIR /server
RUN apk add --update redis
COPY . .
EXPOSE 8888
RUN npm install
CMD ["npm", "start"]
