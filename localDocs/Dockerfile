FROM node:0.10.41

MAINTAINER Srinivas Sunkari "sr.sunkari@gmail.com"
RUN printenv
WORKDIR /app
ADD package.json /app
RUN npm install
ADD . /app

EXPOSE 3000
CMD npm start
