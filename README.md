# Transaction Upload App - This is a challenge by Coodesh

This is a web application for uploading and managing transactions. It allows users to upload a file containing transaction data, parses and normalizes the data, stores it in a relational database, and provides functionality to view transactions by seller and the total sales for each seller.

## Technologies Used

    - Frontend: HTML, CSS, JavaScript (Vanilla JS)
    - Backend: Node.js, Express.js, MySQL
    - Testing: Jest (for both frontend and backend)
    - Docker

## Installation and Usage

1. Clone the repository to your local machine.
2. Make sure you have Node.js and MySQL installed on your system.
3. Navigate to folder and install the dependencies:
    npm install
4. Start the application:
    npm start
5. Open your web browser and access the application at http://localhost:3000.

## Docker Setup

If you want to run the app using Docker, make sure you have Docker installed on your machine.

1. Build the Docker image:
    docker-compose build
2. Run the Docker containers:
    docker-compose up
The app will be accessible at http://localhost:3000 within the Docker environment.

## Set up the MySQL database:
    
Create a new database called transaction_db and set up the necessary table to store transactions. You can use the following SQL command to create the table:

    CREATE TABLE transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type INT NOT NULL,
        date DATETIME NOT NULL,
        product VARCHAR(100) NOT NULL,
        value DECIMAL(10, 2) NOT NULL,
        seller VARCHAR(50) NOT NULL
    );

## How to Use the App

- Upload Transactions: On the homepage, click the "Choose File" button, select a valid transaction file, and click the "Upload" button to upload the transactions.
- View Transactions by Seller: In the "Transactions by Seller" section, enter the name of the seller in the input field and click the "Get Transactions" button to view their transactions. The total sales will be displayed at the bottom of the table.
- View All Transactions Grouped by Seller: In the "All Transactions" section, click the "Get All Transactions" button to view all transactions grouped by seller. The total value of transactions for each seller will be displayed in a table.

## Files Overview

The repository is structured as follows:

    |-- backend/
    |   |-- __tests__/
    |   |   |-- app.test.js
    |   |-- uploads/
    |-- frontend/
    |   |-- __tests__/
    |   |   |-- app.test.js
    |   |-- index.html
    |   |-- styles.css
    |   |-- app.js
    |-- Dockerfile
    |-- sales.txt
    |-- docker-compose.yml
    |-- package.json
    |-- app.js
    |-- utils.js

- The backend/ directory contains the backend code for processing and storing transactions, as well as unit tests for the backend in the __tests__/ subdirectory.
- The frontend/ directory contains the frontend code, including the HTML, CSS, and JavaScript files, as well as unit tests for the frontend in the __tests__/ subdirectory.
- The Dockerfile is used to create a Docker image for the backend service.
- The sales.txt file is an example file containing transaction data.
- The docker-compose.yml file defines the services and their configurations for running the application using Docker.
- The package.json file contains the dependencies and scripts for the backend.
- The app.js file in the root directory is the entry point for the backend server.
- The utils.js file contains utility functions for parsing and handling transaction data.

## Testing

Both the frontend and backend have automated tests:

The backend tests are located in backend/__tests__/app.test.js. These tests ensure that the server endpoints for file upload and transaction retrieval are working correctly.

The frontend tests are located in frontend/__tests__/app.test.js. These tests simulate user interactions with the application and verify that the expected behaviors and responses are displayed.

To run the tests, use the following command:

    docker-compose run backend npm test

    docker-compose run frontend npm test

## Conclusion

The Transaction Upload App is a simple application that allows users to upload transaction data and view it by seller or all transactions grouped by seller. The app uses Node.js, Express.js, and MySQL on the backend, while the front-end is styled with Bootstrap. It provides an easy way to manage transaction data and gain insights into sales for different sellers.
