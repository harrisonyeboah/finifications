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

# Ensure Prisma has DATABASE_URL available at build time
# (Render injects environment variables automatically)
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# Generate Prisma client AND apply migrations
RUN npx prisma generate
RUN npx prisma migrate deploy

# Expose backend port
EXPOSE 8080

# Start server
CMD ["npm", "start"]
