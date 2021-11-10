# Super simple example shop

This has a little of 

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Features

This web app is a demo covering the following features:
- an API that allows to add items to the cart (including multiple at once)
- apply offers
- view cart
- a simple frontend app to use those APIs

### Other info

For simplicity there's no database solution attached. The items are hardcoded in the file system and cart is using in-memory storage.

## Requirements

Node v16 (current LTS) and npm v8.

You can use [nvm](https://github.com/nvm-sh/nvm). This will read .nvmrc, install and use appropriate Node version if you haven't one installed.
```shell
nvm install
```
Make sure to install the project dependencies by running
```shell
npm ci
```

## Development

This web app is meant to be build in Docker for production, however locally it's easier to develop without it.

### Running locally

First, run the development server:
```shell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


[comment]: <> (@TODO update this part of readme)


You can start editing the page by modifying `/src/pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/[id].ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

### Testing

Unit tests are located next to the modules they are testing. Black box tests are located in the `/test` directory. 

### Building

To build the app locally run
```shell
npm run build
```
Once it's build the production-mode server can be run using
```shell
npm start
```

### Deployment

The web app would be deployed using a container, however this is currently out of scope. Please have a look at the `Dockerfile` for some insights.
