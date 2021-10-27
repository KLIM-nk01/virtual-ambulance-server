const { Schema, model, ObjectId } = require("mongoose");

const Patient = new Schema({
    id_user: { type: ObjectId, ref: "User" },
    visit: [{ type: ObjectId, ref: "Doctor" }],
    birthday: { type: String },
    address: { type: String },
});

module.exports = model("Patient", Patient);
