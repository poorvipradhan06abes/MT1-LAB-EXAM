import express from "express";

const app = express();
const PORT = 4000;

app.use(express.json());

// Part B data: stored in memory in a JavaScript array (no database).
let vehicles = [
  { id: 1, vehicleName: "Hyundai Creta", vehicleNumber: "HR26AB1234", type: "SUV", price: 1500000 },
  { id: 2, vehicleName: "Honda City", vehicleNumber: "DL3CAB4567", type: "Sedan", price: 1200000 },
  { id: 3, vehicleName: "Maruti Swift", vehicleNumber: "BR01CD7890", type: "Hatchback", price: 750000 }
];

const requiredFields = ["id", "vehicleName", "vehicleNumber", "type", "price"];

function validateVehicle(vehicle) {
  if (!vehicle || typeof vehicle !== "object" || Array.isArray(vehicle)) {
    return "Request body must be a JSON object";
  }
  const missing = requiredFields.filter(field =>
    vehicle[field] === undefined || vehicle[field] === null || vehicle[field] === ""
  );
  if (missing.length) return `Missing required fields: ${missing.join(", ")}`;
  if (!Number.isInteger(Number(vehicle.id)) || Number(vehicle.id) <= 0) {
    return "id must be a positive integer";
  }
  if (typeof vehicle.price !== "number" || !Number.isFinite(vehicle.price) || vehicle.price <= 0) {
    return "price must be a positive number";
  }
  for (const field of ["vehicleName", "vehicleNumber", "type"]) {
    if (typeof vehicle[field] !== "string" || !vehicle[field].trim()) {
      return `${field} must be a non-empty string`;
    }
  }
  return null;
}

// GET /vehicles - retrieve all vehicles
app.get("/vehicles", (req, res) => {
  res.status(200).json(vehicles);
});

// GET /vehicles/:id - retrieve one vehicle
app.get("/vehicles/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "Vehicle id must be an integer" });
  }
  const vehicle = vehicles.find(item => item.id === id);
  if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
  res.status(200).json(vehicle);
});

// POST /vehicles - add a vehicle
app.post("/vehicles", (req, res) => {
  const validationError = validateVehicle(req.body);
  if (validationError) return res.status(400).json({ message: validationError });

  const newVehicle = { ...req.body, id: Number(req.body.id) };
  if (vehicles.some(item => item.id === newVehicle.id)) {
    return res.status(400).json({ message: "A vehicle with this id already exists" });
  }
  vehicles.push(newVehicle);
  res.status(201).json({ message: "Vehicle added successfully", vehicle: newVehicle });
});

// PUT /vehicles/:id - update an existing vehicle
app.put("/vehicles/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "Vehicle id must be an integer" });
  }
  const index = vehicles.findIndex(item => item.id === id);
  if (index === -1) return res.status(404).json({ message: "Vehicle not found" });

  const updatedVehicle = { ...vehicles[index], ...req.body, id };
  const validationError = validateVehicle(updatedVehicle);
  if (validationError) return res.status(400).json({ message: validationError });

  vehicles[index] = updatedVehicle;
  res.status(200).json({ message: "Vehicle updated successfully", vehicle: updatedVehicle });
});

// DELETE /vehicles/:id - delete a vehicle
app.delete("/vehicles/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "Vehicle id must be an integer" });
  }
  const index = vehicles.findIndex(item => item.id === id);
  if (index === -1) return res.status(404).json({ message: "Vehicle not found" });

  const deletedVehicle = vehicles.splice(index, 1)[0];
  res.status(200).json({ message: "Vehicle deleted successfully", vehicle: deletedVehicle });
});

// Invalid JSON sent to express.json() is handled here.
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ message: "Invalid JSON in request body" });
  }
  next(error);
});

// Unknown endpoint
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});
