# Use Debian-based Node (NOT Alpine)
FROM node:18-slim

WORKDIR /app

# Install dependencies Prisma needs (openssl, libssl, etc.)
RUN apt-get update && \
    apt-get install -y openssl && \
    apt-get clean

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Generate Prisma Client ONLY — does NOT require DB
RUN npx prisma generate

# Expose backend port
EXPOSE 8080

# Start the server
CMD ["npm", "start"]
