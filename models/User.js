const { Schema, model } = require("mongoose");

const User = new Schema({
    name: { type: String, require: true, unique: false },
    lastName: { type: String, require: true, unique: false },
    // photo: { type: String },
    email: { type: String, require: true, unique: true },
    userRole: { type: String, require: true, unique: false },
    password: { type: String, require: true, unique: false },
});

module.exports = model("User", User);
