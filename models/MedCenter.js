const { Schema, model, ObjectId } = require("mongoose");

const MedCenter = new Schema({
    name: { type: String, require: true },
    address: { type: String, require: true },
    photo: { type: String },
    description: { type: String },
    services: [{ type: String }],
    medStaff: [{ type: Schema.Types.ObjectId, ref: "Doctor" }],
    location: { lat: { type: Number }, lon: { type: Number } },
});

module.exports = model("MedCenter", MedCenter);
