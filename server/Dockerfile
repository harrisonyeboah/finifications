# Use Debian-based Node (NOT Alpine)
FROM node:18-slim

WORKDIR /app

# Install system dependencies Prisma needs
RUN apt-get update && apt-get install -y openssl && apt-get clean

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy everything else
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose backend port
EXPOSE 8080

# Start server
CMD ["npm", "start"]
