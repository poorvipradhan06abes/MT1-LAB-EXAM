# MT1-LABEXAM — Vehicle Management Web Application

A Node.js lab-exam implementation based on the supplied question paper.

## Requirements

- Node.js (LTS recommended)
- npm
- Postman (for testing the Express REST API)

No database is used. Vehicle records are stored in JavaScript arrays and reset when the server restarts.

## Project structure

```text
MT1-LABEXAM/
├── package.json
├── httpServer.js
├── expressApp.js
├── public/
│   └── info.html
└── screenshots/
```

## 1. Install dependencies

Open this folder in VS Code. In the VS Code terminal, run:

```bash
npm install
```

## 2. Run Part A — Node.js HTTP + FS modules

In terminal 1:

```bash
node httpServer.js
```

Expected message:

```text
HTTP Server running at http://localhost:3000
```

Open these URLs in your browser:

| URL | Purpose |
|---|---|
| http://localhost:3000/ | Welcome page |
| http://localhost:3000/vehicles | All vehicles as JSON |
| http://localhost:3000/about | Application information |
| http://localhost:3000/info | Static `public/info.html` served using `fs.readFile()` |

To add a vehicle, send a `POST` request to `http://localhost:3000/add-vehicle` with Body → raw → JSON:

```json
{
  "id": 4,
  "vehicleName": "Maruti Swift",
  "vehicleNumber": "BR01CD7890",
  "type": "Hatchback",
  "price": 750000
}
```

## 3. Run Part B — Express REST API

Keep Part A running. Open a second VS Code terminal:

```bash
node expressApp.js
```

Expected message:

```text
Express Server running at http://localhost:4000
```

### API endpoints

| Method | URL | Purpose |
|---|---|---|
| GET | `http://localhost:4000/vehicles` | Get all vehicles |
| GET | `http://localhost:4000/vehicles/1` | Get vehicle with ID 1 |
| POST | `http://localhost:4000/vehicles` | Add a vehicle |
| PUT | `http://localhost:4000/vehicles/1` | Update vehicle with ID 1 |
| DELETE | `http://localhost:4000/vehicles/1` | Delete vehicle with ID 1 |

For POST, choose Body → raw → JSON in Postman:

```json
{
  "id": 4,
  "vehicleName": "Maruti Swift",
  "vehicleNumber": "DL8CAF5030",
  "type": "Hatchback",
  "price": 750000
}
```

For PUT, send the fields you want to update. The existing ID is retained from the URL.

### Expected status codes

- `200` — successful GET, PUT or DELETE
- `201` — vehicle created
- `400` — invalid JSON, missing fields or invalid price/ID
- `404` — unknown route or vehicle ID not found
- `500` — static information file could not be read

## 4. Suggested testing order

1. Start `httpServer.js` and visit `/`, `/vehicles`, `/about` and `/info`.
2. Use Postman to test `POST http://localhost:3000/add-vehicle`.
3. Start `expressApp.js` in another terminal.
4. Test GET all, GET by ID, POST, PUT and DELETE in Postman.
5. Also test an ID that does not exist (for example `/vehicles/999`) and an invalid JSON body.
6. Capture screenshots and save them in the `screenshots/` folder.

## 5. GitHub submission

Create a GitHub repository named **MT1-LABEXAM**. From this project folder:

```bash
git init
git add .
git commit -m "Initial project structure"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/MT1-LABEXAM.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username. Add meaningful commits as you complete and test each module.

## Notes

- Part A uses only the built-in `http` and `fs` modules; it does not use Express.
- Part B uses Express and `express.json()` middleware.
- Both servers run independently: Part A on port **3000**, Part B on port **4000**.
- Data is held in memory, as required by the question. It is not permanent and will reset when a server restarts.
