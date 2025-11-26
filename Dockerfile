# Use an official Node.js runtime
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the backend code
COPY . .

# Expose the backend port
EXPOSE 8080

# Start the backend
CMD ["node", "server.js"]
