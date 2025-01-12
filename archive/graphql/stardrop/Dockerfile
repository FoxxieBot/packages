FROM --platform=linux/amd64 node:22-alpine

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .
COPY tsup.config.ts tsup.config.ts
COPY src/ src/

RUN yarn

RUN yarn build

CMD [ "yarn", "run", "start" ]
