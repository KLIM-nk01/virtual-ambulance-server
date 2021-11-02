const { Schema, model, ObjectId } = require("mongoose");

const Doctor = new Schema({
    userData: { type: ObjectId, ref: "User" },
    name: { type: String, require: true, unique: false },
    lastName: { type: String, require: true, unique: false },
    // photo: { type: String },
    email: { type: String, require: true, unique: true },
    phone: { type: String },
    experience: { type: String, require: true },
    direction: { type: String, ref: "Direction" },
    workPlace: { type: String },
    workTime: [{ date: String, time: String }],
    patients: [{ type: ObjectId, ref: "Patient" }],
});

module.exports = model("Doctor", Doctor);
