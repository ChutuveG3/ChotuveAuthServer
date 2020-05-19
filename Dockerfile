FROM node:10.14.1

WORKDIR /home/app

COPY package.json .
COPY package-lock.json .
COPY .nvmrc .

RUN npm install

COPY . .

RUN npm run migrations

EXPOSE 8080
CMD npm start
