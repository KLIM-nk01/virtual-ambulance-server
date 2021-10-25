const { Schema, model, ObjectId } = require("mongoose");

const Doctor = new Schema({
    id_user: {type: ObjectId, ref: 'User'},
    name: { type: String, require: true, unique: false },
    lastName: { type: String, require: true, unique: false },
    // photo: { type: String },
    email: { type: String, require: true, unique: true },
    phone: {type: String, require: true, unique: true},
    experience: {type: String, require: true},
    direction: {type: ObjectId, ref: 'Direction'},
    workPlace: {type: ObjectId, ref: 'MedCenter'},
    workTime: [{date: String, time: String}],
    patients: [{type: ObjectId, ref: 'Patient'}],
    
});

module.exports = model("Doctor", Doctor);
