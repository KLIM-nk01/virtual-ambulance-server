const { Schema, model, ObjectId } = require("mongoose");

const Doctor = new Schema({
    userData: { type: ObjectId, ref: "User" },
    name: { type: String, require: true, unique: false },
    lastName: { type: String, require: true, unique: false },
    phone: { type: String },
    experience: { type: String, require: true },
    direction: { type: String, ref: "Direction" },
    description: { type: String },
    workPlace: { type: Schema.Types.ObjectId, ref: "MedCenter" },
    workTime: [{ type: ObjectId, ref: "DateTime" }],
    patients: [{ type: ObjectId, ref: "Patient" }],
});

module.exports = model("Doctor", Doctor);
