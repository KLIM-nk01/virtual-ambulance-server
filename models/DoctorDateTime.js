const { Schema, model, ObjectId } = require("mongoose");

const DateTime = new Schema({
    idDoctor: { type: ObjectId, ref: "Doctor" },
    idPatient: {type: ObjectId, ref: "Patient"},
    date: { type: String },
    time: { type: String },
});

module.exports = model("DateTime", DateTime);
