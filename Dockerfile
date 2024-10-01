FROM node:20

WORKDIR /usr/src/santander-experience-backend

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "node", "index.js" ]
