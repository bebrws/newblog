FROM node:14.13.1-alpine3.10

RUN apk update
RUN apk add --no-cache tini

RUN mkdir /app

WORKDIR /app
COPY . ./

RUN npm install && npm run build

ENTRYPOINT [ "tini", "--" ]
CMD cd /app && npx next start -p 80

# while [ ! -f /app/package.json ]; do sleep 1; done; cd /app && npm install && npm run build && next start -p 80