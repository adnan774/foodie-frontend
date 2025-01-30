# Use Node.js as the base image for building the app
FROM node:18 as build

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Angular application for production
RUN npm run build --prod

# Use NGINX as the base image to serve the frontend
FROM nginx:alpine

# Copy the built Angular app to the NGINX directory
COPY --from=build /usr/src/app/dist/frontend /usr/share/nginx/html

# Expose port 80 for the web server
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]