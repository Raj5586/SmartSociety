import express from "express";
import House from "../models/houseModel.js";

const router = express.Router();

// ✅ Get all houses
router.get("/", async (req, res) => {
  try {
    const houses = await House.find();
    res.json(houses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Add a new house
router.post("/", async (req, res) => {
  try {
    const newHouse = new House(req.body);
    await newHouse.save();

    console.log(`✅ New house added: ${newHouse.houseNumber}`);

    // Real-time update for all clients
    req.io.emit("houseAdded", newHouse);

    res.status(201).json(newHouse);
  } catch (error) {
    console.log("❌ Error adding house:", error.message);
    res.status(400).json({ message: error.message });
  }
});

// ✅ Delete a house
router.delete("/:id", async (req, res) => {
  try {
    const house = await House.findByIdAndDelete(req.params.id);
    if (!house) return res.status(404).json({ message: "House not found" });

    // Emit real-time delete event
    req.io.emit("houseDeleted", req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Update a house (edit details)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const house = await House.findByIdAndUpdate(id, updatedData, { new: true });
    if (!house) return res.status(404).json({ message: "House not found" });

    req.io.emit("houseUpdated", house);
    res.json({ message: "House updated successfully", house });
  } catch (error) {
    console.error("❌ Error updating house:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// ✅ Mark maintenance as paid
router.put("/:id/pay", async (req, res) => {
  try {
    const { id } = req.params;

    // Check if valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid house ID" });
    }

    const house = await House.findById(id);
    if (!house) return res.status(404).json({ message: "House not found" });

    // Mark as paid
    house.maintenanceDue = 0;
    await house.save();

    // Emit real-time update
    req.io.emit("houseUpdated", house);

    console.log(`✅ Maintenance paid for house: ${house.houseNumber}`);
    res.json({ message: "Payment marked as paid", house });
  } catch (error) {
    console.error("❌ Error in /pay route:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
