# Use the official Node.js runtime as the base image
FROM node:18-alpine

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Copy the rest of the application code
COPY . .

# Install dependencies (including dev dependencies)
RUN npm ci

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the application in development mode
CMD ["npm", "run", "dev"] 