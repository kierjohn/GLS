# Getting started

This project was bootstrapped with
[Create React App](https://github.com/facebook/create-react-app).

# Run app locally

Install `yarn` if not available in your system. avoid `npm` for this project.

1. setup `.env.local` (assuming backend is already up and running locally. see backend readme for more details)
2. `yarn`
3. `yarn start:local`

**note: use `.env.stage` and `yarn start:stage` to setup and run app using the staging API.U**

# Scripts

### `yarn start:local`

Use when running the app locally. you can setup your environment through `.env.local`.
contact admin for more info. http://localhost:3000

### `yarn start:stage`

Use for the staging site or when accessing the staging api. you can setup your environment
through `.env.stage`. contact admin for more info. http://localhost:3000

### `yarn start:prod`

**avoid using production api during development** Use for the live site or when accessing
the live api. you can setup your environment through `.env.production`. contact admin for
more info. http://localhost:3000

### `yarn build:local`

### `yarn build:stage`

### `yarn build:prod`

use to build the app for local, stage and production.
