FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

RUN chmod +x ./start.sh

CMD ["./start.sh"]
