# Use an official Node.js LTS image
FROM node:18.20.8

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all other source files
COPY . .

# Expose backend port
EXPOSE 4000

# Start the server
CMD ["npm", "start"]
