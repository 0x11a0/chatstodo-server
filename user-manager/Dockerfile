# Use the Node 20 Alpine image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml for pnpm installation
COPY ./package.json ./package-lock.json ./

# Install dependencies
RUN npm install 

# Copy all the other source files
COPY . .

# Start the application
CMD ["npm", "start"]
