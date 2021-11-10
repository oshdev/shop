# Super simple example shop

This has a little of 

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Features

This web app is a demo covering the following features:
- an API that allows to add items to the cart (including multiple at once)
- apply offers
- view cart
- a simple frontend app to use those APIs (@todo)

### Other info

The requirements are loosely defined. There was a number of assumptions made. In typical workflow, I'd consult with the stakeholders over the course of development to get answer to the questions that arise from the spec.

This demo does not include persistent storage, the cart is saved in memory. There's also only a single one to use for the application.

Currency and monetary precision is discarded. In real word application, there would be constraints applied.

The offers' mechanism is also pretty simple - it takes care that each item is not used more than once in any offer. On the other side it supports only a single item that would be on the offer; and it does not support offers that overlap with one another, etc. 

### API

- `GET /api/items` - returns a list of available items
```shell
curl 'http://localhost:3000/api/items'
[{"name":"apple","price":100},{"name":"banana","price":200},{"name":"chocolate","price":300},{"name":"dumpling","price":400}]
```

- `POST /api/cart` - modifies the cart contents
```shell
curl --request POST 'http://localhost:3000/api/cart' \
--header 'Content-Type: application/json' \
--data-raw '{
    "itemName": "chocolate",
    "quantity": 5
}'
{"cart":[{"itemName":"chocolate","quantity":5}]}

curl --request POST 'http://localhost:3000/api/cart' \
--header 'Content-Type: application/json' \
--data-raw '{
    "itemName": "chocolate",
    "quantity": -2
}'
{"cart":[{"itemName":"chocolate","quantity":3}]}
```

- `DELETE /api/cart` - empties the cart
```shell
curl --request DELETE 'http://localhost:3000/api/cart'
{"cart":[]}
```

- `GET /api/cart` - checks out the cart
```shell
curl 'http://localhost:3000/api/cart/checkout'
{"items":{"apple":{"price":100,"quantity":10},"banana":{"price":200,"quantity":10}},"offersApplied":[{"amount":1000,"offer":"buy 2 apples get banana half price"}],"vatApplied":{"percent":0.14,"amount":280},"total":2280}
```

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

Next.js uses path-based routing - the pages are located in `/src/pages` and the API endpoints in `/src/pages/api`.

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

You can also build and run the Docker container
```shell
docker build --tag shop .
docker run -it --rm -p 3000:3000 shop
```

### Deployment

The web app would be deployed using a container, however this is currently out of scope. Please have a look at the `Dockerfile` for some insights.
