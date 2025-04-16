FROM node:20-slim

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Cloud Run sets PORT automatically, so we just expose it
EXPOSE 8080

# Use a more reliable way to start your application
CMD ["node", "dist/main.js"]