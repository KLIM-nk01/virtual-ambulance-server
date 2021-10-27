const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");

exports.registrationUser_post = async (req, res) => {
    try {
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
            workPlace,
        } = req.body;

        const check_email = await User.findOne({ email });
        const check_phone = await User.findOne({ phone });

        if (check_email) {
            return res.status(400).json({
                message: `User with email ${email} already exist`,
            });
        } else if (check_phone) {
            return res.status(400).json({
                message: `User with phone ${phone} already exist`,
            });
        } else {
            const hashPassword = await bcrypt.hash(password, 8);
            const user = new User({
                name,
                lastName,
                email,
                phone,
                // photo,
                password: hashPassword,
                userRole,
            });
            await user.save();

            if (userRole === "patient") {
                const patient = new Patient({
                    id_user: user.id,
                    visit: [],
                    birthday,
                    address,
                });
                await patient.save();
            } else if (userRole === "doctor") {
                const doctor = new Doctor({
                    id_user: user.id,
                    experience,
                    direction: direction.value,
                    workPlace: workPlace.value,
                    workTime: [],
                    patients: [],
                });
                await doctor.save();
            }
        }

        return res.status(201).send({ message: "User was created" });
    } catch (e) {
        console.log(e);
        res.send({ message: "Server error" });
    }
};
