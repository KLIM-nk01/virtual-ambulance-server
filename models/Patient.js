const { Schema, model, ObjectId } = require("mongoose");

const Patient = new Schema({
    userData: { type: ObjectId, ref: "User" },
    visit: [{ type: ObjectId, ref: "DateTime" }],
    birthday: { type: String },
    address: { type: String },
});

module.exports = model("Patient", Patient);
