FROM node:16-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000

# Create a .env file at build time
ARG PORT
ARG MONGO_URL
ARG NODE_ENV
ENV PORT=${PORT}
ENV MONGO_URL=${MONGO_URL}
ENV NODE_ENV=${NODE_ENV}

CMD ["npm","start"]