# Stage 1: Build the Angular App
FROM node:18 as build

WORKDIR /usr/src/app

# Copy package.json & package-lock.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy source files and build Angular app
COPY . .
RUN npm run build --configuration=production

# Stage 2: Serve the Angular App with NGINX
FROM nginx:alpine

# Copy the built Angular app to the NGINX HTML directory
COPY --from=build /usr/src/app/dist/foodie-frontend /usr/share/nginx/html

# Copy a custom NGINX configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for the web server
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
