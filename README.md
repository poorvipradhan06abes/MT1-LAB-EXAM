# Vehicle Management System

## Project Overview
This project is a Vehicle Management System developed using Node.js and Express.js. It demonstrates HTTP server creation and REST API operations for managing vehicle records.

## Technologies Used
- Node.js
- Express.js
- JavaScript
- HTTP Module
- Postman (API Testing)

## Project Structure

```text
MT1-LABEXAM/
│
├── node_modules/
├── public/
│   └── info.html
│
├── A/
│   └── Screenshots of API Output
│
├── httpServer.js
├── expressApp.js
├── package.json
├── package-lock.json
└── README.md
```

## Part A: Node.js HTTP Module

The HTTP module is used to create a basic server.

### Features
- GET – Retrieve vehicle information.
- POST – Add a new vehicle.
- Display information using JSON responses.
- Serve a static HTML page.
- Handle invalid routes.

**Server URL:** `http://localhost:3000`

## Part B: Express.js

Express.js is used to create REST APIs for vehicle management.

### CRUD Operations

| Method | Operation |
|---|---|
| GET | Retrieve all vehicles |
| GET | Retrieve vehicle by ID |
| POST | Add a new vehicle |
| PUT | Update vehicle details |
| DELETE | Delete a vehicle |

**Server URL:** `http://localhost:4000`

## Installation and Execution

### 1. Install Dependencies

```bash
npm install
```

### 2. Start HTTP Server

```bash
node httpServer.js
```

### 3. Start Express Server

Open another terminal and run:

```bash
node expressApp.js
```

## API Testing

All API endpoints are tested using Postman.

Both servers should be running while testing their respective endpoints.

## Screenshots

All screenshots of the project execution and Postman API testing outputs are available in the **A** folder.

The folder contains screenshots demonstrating the API requests and their corresponding responses.

## Note

This project uses in-memory data storage (JavaScript arrays). Data is reset whenever the server restarts.

---

**Project:** Vehicle Management System  
**Developed using:** Node.js and Express.js  
**Purpose:** MT1 Lab Examination
