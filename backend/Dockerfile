FROM node:20-alpine

# 1. Set the working directory to the root level inside the container
WORKDIR /usr/src

# 2. Copy the backend package files and install dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# 3. Copy the entire backend and frontend folders into the container
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# 4. Move into the backend folder so we can start the server
WORKDIR /usr/src/backend

EXPOSE 5000

CMD ["npm", "run", "dev"]