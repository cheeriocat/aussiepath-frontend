# Use official lightweight Node 22 runtime
FROM node:22-slim

# Create app directory
WORKDIR /usr/src/app

# Copy package descriptors
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Bundle application source files
COPY . .

# Create volume mount directory
RUN mkdir -p /data

# Default runtime configuration
ENV NODE_ENV=production
ENV PORT=5000
ENV DATA_DIR=/data

# Expose port 5000 for server requests
EXPOSE 5000

# Start server.js directly
CMD [ "node", "src/server.js" ]
