const bcrypt = require("bcryptjs");
const { check, validateResult } = require("express-validator");
const User = require("../models/User");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");

exports.registrationUser_post = async (req, res) => {
    try {
        console.log(req.body);
        const {
            name,
            lastName,
            email,
            phone,
            password,
            userRole,
            birthday,
            address,
            experience,
            direction,
        } = req.body;

        const candidate = await User.findOne({ email });

        if (candidate) {
            return res
                .status(400)
                .json({ message: `User with email ${email} already exist` });
        } else {
            const hashPassword = await bcrypt.hash(password, 8);
            const user = new User({
                name,
                lastName,
                email,
                // photo,
                password: hashPassword,
                userRole,
            });
            await user.save();
            if (userRole === "patient") {
                const patient = new Patient({
                    id_user: user.id,
                    name,
                    lastName,
                    // photo: { type: String },
                    email,
                    phone,
                    visit: [],
                    birthday,
                    address,
                });
                await patient.save();
            } else if (userRole === "doctor") {
                const doctor = new Doctor({
                    id_user: user.id,
                    name,
                    lastName,
                    // photo: { type: String },
                    email,
                    phone,
                    experience,
                    direction,
                    workPlace,
                    workTime: [],
                    patients: [],
                });
            }
        }

        return res.status(201).send({ message: "User was created" });
    } catch (e) {
        console.log(e);
        res.send({ message: "Server error" });
    }
};
