const { Scheme, model } = require( "mongoose");

const User = new Scheme({
    name: {type: String, require: true, unique: false},
    lastName: {type: String, require: true, unique: false},
    photo: {type: String},
    email: {type: String, require: true, unique: true},
    role: {type: String, require: true, unique: false},
    password: {type: String, require: true, unique: false},
})

module.exports = model('User', User)