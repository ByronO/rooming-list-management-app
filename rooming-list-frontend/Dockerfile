# Stage 1: Build the React app using Vite
FROM node:18.20.8 AS builder

# Set working directory
WORKDIR /app

# Copy source code
COPY . .

# Install dependencies
RUN npm install

# Build the app for production
RUN npm run build

# Stage 2: Serve the built files using Nginx
FROM nginx:alpine

# Copy the build output to the default Nginx public directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose Nginx default port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
