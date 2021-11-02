const { Schema, model, ObjectId } = require("mongoose");

const MedCenter = new Schema({
    // id_medcenter: { type: ObjectId, ref: "User" },
    name: { type: String, require: true },
    address: { type: String, require: true },
    photo: { type: String },
    description: { type: String },
    services: [{ type: String }],
    medStaff: [{ type: Schema.Types.ObjectId, ref: "Doctor" }],
    location: { lat: { type: Number }, log: { type: Number } },
});

module.exports = model("MedCenter", MedCenter);
