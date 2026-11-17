import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000;

// Part A data: stored in a JavaScript array (no database).
const vehicles = [
  { id: 1, vehicleName: "Hyundai Creta", vehicleNumber: "HR26AB1234", type: "SUV", price: 1500000 },
  { id: 2, vehicleName: "Honda City", vehicleNumber: "DL3CAB4567", type: "Sedan", price: 1200000 },
  { id: 3, vehicleName: "Maruti Swift", vehicleNumber: "BR01CD7890", type: "Hatchback", price: 750000 }
];

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data, null, 2));
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Request body is too large"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = requestUrl.pathname;

  // GET /
  if (req.method === "GET" && pathname === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Vehicle Management</title>
<style>
body{font-family:Arial,sans-serif;background:#f4f7fb;margin:0;padding:40px;color:#1f2937}
main{max-width:760px;margin:auto;background:white;padding:32px;border-radius:14px;box-shadow:0 5px 22px #0001}
h1{color:#155e75}a{display:inline-block;margin:8px 12px 8px 0;color:#0369a1}
</style></head>
<body><main><h1>Vehicle Management Application</h1>
<p>Welcome! This is the Node.js HTTP module server.</p>
<h2>Available routes</h2>
<a href="/vehicles">View vehicles (JSON)</a><a href="/about">About</a><a href="/info">Information page</a>
</main></body></html>`);
    return;
  }

  // GET /vehicles
  if (req.method === "GET" && pathname === "/vehicles") {
    sendJson(res, 200, vehicles);
    return;
  }

  // POST /add-vehicle
  if (req.method === "POST" && pathname === "/add-vehicle") {
    try {
      const rawBody = await readRequestBody(req);
      let vehicle;
      try {
        vehicle = JSON.parse(rawBody);
      } catch {
        sendJson(res, 400, { message: "Invalid JSON in request body" });
        return;
      }

      const requiredFields = ["id", "vehicleName", "vehicleNumber", "type", "price"];
      const missingFields = requiredFields.filter(field =>
        vehicle[field] === undefined || vehicle[field] === null || vehicle[field] === ""
      );
      if (missingFields.length > 0) {
        sendJson(res, 400, { message: "Missing required fields", missingFields });
        return;
      }
      if (!Number.isInteger(Number(vehicle.id)) || Number(vehicle.id) <= 0 ||
          typeof vehicle.price !== "number" || !Number.isFinite(vehicle.price) || vehicle.price <= 0) {
        sendJson(res, 400, { message: "id must be a positive integer and price must be a positive number" });
        return;
      }
      if (vehicles.some(item => item.id === Number(vehicle.id))) {
        sendJson(res, 400, { message: "A vehicle with this id already exists" });
        return;
      }

      const newVehicle = { ...vehicle, id: Number(vehicle.id) };
      vehicles.push(newVehicle);
      sendJson(res, 201, { message: "Vehicle added successfully", vehicle: newVehicle });
    } catch (error) {
      sendJson(res, 400, { message: error.message || "Unable to read request body" });
    }
    return;
  }

  // GET /about
  if (req.method === "GET" && pathname === "/about") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end("<h1>About Vehicle Management</h1><p>A simple Node.js application demonstrating HTTP routing, JSON data and file serving.</p>");
    return;
  }

  // GET /info - static HTML file served using fs.readFile()
  if (req.method === "GET" && pathname === "/info") {
    const infoPath = path.join(__dirname, "public", "info.html");
    fs.readFile(infoPath, "utf8", (error, content) => {
      if (error) {
        sendJson(res, 500, { message: "Unable to read public/info.html" });
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(content);
    });
    return;
  }

  sendJson(res, 404, { message: "Route not found" });
});

server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});
