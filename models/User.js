const { Schema, model } = require("mongoose");

const User = new Schema({
    userRole: { type: String },
    name: { type: String },
    lastName: { type: String },
    // photo: { type: String },
    phone: { type: String, require: true, unique: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true, unique: false },
});

module.exports = model("User", User);
