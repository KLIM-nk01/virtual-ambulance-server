const { Schema, model, ObjectId } = require("mongoose");

const Patient = new Schema({
    id_user: {type: ObjectId, ref: 'User'},
    name: { type: String, require: true, unique: false },
    lastName: { type: String, require: true, unique: false },
    // photo: { type: String },
    email: { type: String, require: true, unique: true },
  
    phone: {type: String},
    visit: [{type: ObjectId, ref: 'Doctor'}],
    birthday: {type: String},
    address: {type: String}
});

module.exports = model("Patient", Patient);
