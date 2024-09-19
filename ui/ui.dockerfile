FROM node:18.20.2

WORKDIR /gogollm

COPY . .

WORKDIR /gogollm/ui

RUN npm config set registry https://registry.npmmirror.com

RUN npm install

RUN npm run build