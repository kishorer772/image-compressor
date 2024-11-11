FROM node:18-alpine as build

WORKDIR /app

COPY . /app

RUN npm install

RUN npm run build

# Stage 2: Serve with a lightweight server
FROM nginx:alpine

# Copy built files from the previous stage to the nginx container
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 to serve the app
EXPOSE 80

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]