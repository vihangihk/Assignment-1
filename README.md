# My React App

## Overview

This is a React application that allows users to upload files and manage a user list. The app includes features for file uploads and CRUD operations for user management. It interacts with a backend server for data storage and retrieval.

## Features

- **File Upload**: Users can upload files which are sent to the server.
- **User Management**: Users can add new users with name and age, view a list of existing users, and receive notifications for success or failure of operations.

## Technologies Used

- **React**: Frontend library for building user interfaces.
- **Axios**: Promise-based HTTP client for making requests to the backend.
- **React Router**: For navigation between components.

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables: Create a .env file in the root directory and add the following line:
    ```bash
    REACT_APP_BACKEND_HOST=<your-backend-url>
    ```

4. Start the development server:
    ```bash
    npm start
    ```

## Installation

- Navigate to ```/upload``` to upload files.
- Navigate to ```/users``` to manage the user list.


## Components

### FileUpload

Handles file selection and upload functionality. Displays notifications based on the result of the upload.

### User

Manages user data. Allows adding new users and fetching the current list of users. Displays notifications for successful or failed operations.



