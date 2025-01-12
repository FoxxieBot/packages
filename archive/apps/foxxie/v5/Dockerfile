FROM node:22

WORKDIR /

COPY package*.json .

RUN yarn install

COPY assets/ assets/
COPY scripts/ scripts/
COPY src/ src/
COPY tsconfig.json tsconfig.json

RUN yarn build

ENV NODE_ENV="production"

COPY .env .env

CMD [ "yarn", "start" ]
