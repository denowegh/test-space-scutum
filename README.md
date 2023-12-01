# React App in Docker

This repository contains a React application.

## Getting Started

Follow these steps to build and run the Docker container:

1. **Build the Docker container:**

   ```bash
   docker build -t react-app .
   ```

2. **Run the Docker container:**

   ```bash
   docker run -p 3000:3000 react-app
   ```

   The application will be accessible at http://localhost:3000 in your browser.

## Project Structure

- `src/`: Contains the source code of the React application.
- `Dockerfile`: Configuration for building the Docker image.
- `.dockerignore`: Specifies files and directories to be excluded from the Docker image.
- `package.json` and `package-lock.json`: Node.js project configuration files.

## Available Scripts

In the project directory, you can run the following npm scripts:

- `npm start`: Runs the app in development mode.
- `npm build`: Builds the app for production to the `build` folder.
- `npm test`: Launches the test runner.
- `npm eject`: Removes the single build dependency from your project.

Feel free to customize the project structure and configuration based on your specific requirements.
