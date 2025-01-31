# Use Node.js as the base image for building the app
FROM node:18 as build

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Angular application for production
RUN npm run build --configuration=production

# Use NGINX as the base image to serve the frontend
FROM nginx:alpine

# Copy the built Angular app correctly (from 'browser' directory)
COPY --from=build /usr/src/app/dist/foodie-frontend/browser /usr/share/nginx/html

# Copy custom Nginx config (if needed)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for the web server
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
