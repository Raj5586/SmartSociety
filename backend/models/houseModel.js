import mongoose from "mongoose";

const houseSchema = new mongoose.Schema({
  houseNumber: {
    type: String,
    required: true,
    unique: true
  },
  ownerName: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  maintenanceDue: {
    type: Number,
    required: true
  }
});

const House = mongoose.model("House", houseSchema);
export default House;
