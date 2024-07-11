# Fuel API

Simple API for exposition game. API has no authentication and is used to store emails and create fuel transactions.

## Set up

This API is build using `express.js`, it uses `MySQL` to store email and score information and it communicates with `FUEL network` smart contracts via Fuel SDK.
It requires a fuel private key to create transactions and information about the contract its interacting with.

### Requirements

- `MySql` database
- node version 18+
- deployed fuel smart contracts

#### MySql docker

You can run MySQL in docker. For that a docker compose file is prepared: `docker-compose.development.yaml`. You can change password and database in the file. `root` is the default user.

To run it use:

```sh
docker-compose -f docker-compose.development.yaml build
docker-compose -f docker-compose.development.yaml up -d
```

### Environment

You need to setup a `.env` file with variables described below. You can use `.env.sample` file as you basis for easy setup.

First part is Application setup.

- `APP_ENV` Environment in which you API is running. For example: `local`, `development`, `production` etc.
- `APP_SECRET` Secret used for JWT.
- `API_PORT` Port on which the API will be running.

Second is MYSQL configuration:

- `MYSQL_HOST` mysql hostname
- `MYSQL_PORT` mysql port
- `MYSQL_DB` mysql database name
- `MYSQL_USER` mysql user
- `MYSQL_PASSWORD` mysql password
- `MYSQL_POOL` mysql pool size

Third is MYSQL testing configuration. This is only needed if you will be running tests.

- `MYSQL_HOST_TEST` mysql hostname
- `MYSQL_PORT_TEST` mysql port
- `MYSQL_DB_TEST` mysql database name
- `MYSQL_USER_TEST` mysql user
- `MYSQL_PASSWORD_TEST` mysql password
- `MYSQL_POOL_TEST` mysql pool size

Forth is FUEL configuration:

- `CONTRACT_ID` Address of the fuel booth game smart contract
- `SIGNER_PRIVATE_KEY` Private key of the signer that is creating transaction upon the fuel booth game (make sure it has enough funds).
- `SIGNER_ADDRESS` Address of the signer,

### MySQL Migrations

Run `npm run db-upgrade` to run the migrations.

### Install

Run `npm i` to install all dependencies.

### Run

Run `npm run dev` to start the server locally.

### Running tests

Run `npm run test`.

## Endpoints

- GET `/`
- POST `/users`
- GET `/users`
- GET `/users/:id`
- POST `/users/score`

Development helper endpoints:

- GET `/players`
- GET `/balance`

```

```
