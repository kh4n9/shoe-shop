FROM node:lastest

WORKDIR /app

COPY . .

RUN npm i

CMD ['npm', 'run', 'dev']