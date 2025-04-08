# Use Node.js LTS base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy only the package.json and lock file first for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all remaining app files
COPY . .

# Build the application
RUN npm run build

# Expose the port your app uses (default: 3000)
EXPOSE 3000

# Start the app using node
CMD ["node", "dist/main"]
