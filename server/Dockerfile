# Use Debian-based Node (NOT Alpine)
FROM node:18-slim

# Set working directory inside container
WORKDIR /app

# Install dependencies Prisma needs (openssl, libssl, etc.)
RUN apt-get update && \
    apt-get install -y openssl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the app
COPY . .

# Generate Prisma Client (does NOT require DB connection)
RUN npx prisma generate

# Expose backend port
EXPOSE 8080

# Command to wait for Postgres, deploy migrations, and start server
CMD ["sh", "-c", "node prisma-wait.js && npx prisma migrate deploy && npm start"]
