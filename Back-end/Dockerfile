FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

# Copy toàn bộ source
COPY . .

EXPOSE 5000

CMD ["node", "src/server.js"]
