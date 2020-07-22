# ChotuveAuthServer

[![Coverage Status](https://coveralls.io/repos/github/ChutuveG3/ChotuveAuthServer/badge.svg?branch=develop)](https://coveralls.io/github/ChutuveG3/ChotuveAuthServer?branch=develop)

[![Build Status](https://travis-ci.org/ChutuveG3/ChotuveAuthServer.svg?branch=develop)](https://travis-ci.org/ChutuveG3/ChotuveAuthServer)

## First steps

**Installing NodeJs** 

Install NodeJS and npm via the official site (https://nodejs.org)

**Installing dependencies**

Run `npm install` to install dependencies.

**Database setup**

Install PostgreSQL (https://www.postgresql.org/) and create a database for the project.

Having PostgreSQL and a database , create a .env file with the following variables:

```
DB_NAME=...
DB_USERNAME=...
DB_PASSWORD=...
DB_HOST=...
DB_PORT=...
```

**Running migrations**

Run all migrations with `npm run migrations`.

Create a new migration with: `npm run create-migration -- --name migration-name`.

**Starting app**

Run `npm start` to start de application.

Running `npm run start-dev` will start the application with `nodemon` in development mode.

**Running tests**

There are two ways to run the tests:

`npm run test`: It will run the tests suites.

`npm run cover`: It will run the tests suites and give a detailed coverage report.