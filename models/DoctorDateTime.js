const { Schema, model, ObjectId } = require("mongoose");

const DateTime = new Schema({
  doctorData: { type: ObjectId, ref: "Doctor" },
  patientData: { type: ObjectId, ref: "Patient" },
  date: { type: String },
  time: { type: String },
  roomLink: { type: String },
});

module.exports = model("DateTime", DateTime);
