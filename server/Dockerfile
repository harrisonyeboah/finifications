# Use official Node.js LTS image
FROM node:20-alpine

# Install OpenSSL 1.1 and other dependencies
RUN apk add --no-cache openssl1.1-compat

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy the rest of the source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose server port
EXPOSE 8080

# Start the server
CMD ["node", "server.js"]
