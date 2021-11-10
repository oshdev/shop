FROM node:16-slim
WORKDIR /usr/src/app

COPY tsconfig.json next-env.d.ts .babelrc next.config.js ./
COPY typings typings

COPY package.json package-lock.json ./
RUN npm ci

COPY src src
COPY public public

RUN npm run build

EXPOSE 3000

CMD npm run start
