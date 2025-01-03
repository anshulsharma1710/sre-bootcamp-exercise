# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code into the container (including migrations)
COPY . .  
# This copies everything from your local project directory, including migrations

# Expose the port the app runs on
EXPOSE 3000

# Define environment variables (optional; use if you have defaults)
ENV NODE_ENV=development

# Command to run the application
CMD ["npm", "start"]
