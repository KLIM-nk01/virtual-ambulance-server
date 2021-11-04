const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const jwt = require("jsonwebtoken");
const config = require("config");
const MedCenter = require("../models/MedCenter");
const { ObjectId } = require("mongoose");
exports.registrationUserPost = async (req, res) => {
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
            photo,
        } = req.body;

        const check_email = await User.findOne({ email });
        const check_phone = await User.findOne({ phone });

        if (check_email) {
            return res.status(400).json({
                message: `User with email ${email} already exist`,
            });
        }
        if (check_phone) {
            return res.status(400).json({
                message: `User with phone ${phone} already exist`,
            });
        }
        const hashPassword = await bcrypt.hash(password, 8);

        const user = new User({
            name,
            lastName,
            email,
            phone,
            photo:
                photo === "undefined"
                    ? "http://localhost:3000/Assets/userPhoto/NoAvatar.png"
                    : photo,
            password: hashPassword,
            userRole,
        });
        await user.save();

        if (userRole === "patient") {
            const patient = new Patient({
                userData: user.id,
                visit: [],
                birthday,
                address,
            });
            await patient.save();
        } else if (userRole === "doctor") {
            const doctor = await new Doctor({
                userData: user.id,
                experience,
                direction: direction,
                workPlace: workPlace,
                workTime: [],
                patients: [],
            });
            await doctor.save();
            await MedCenter.findOneAndUpdate(
                { _id: workPlace },
                {
                    $push: {
                        medStaff: doctor.id,
                    },
                }
            );
        }
        const token = jwt.sign({ id: user.id }, config.get("secretKey"), {
            expiresIn: "1h",
        });
        return res.status(201).send({
            token,
            user: {
                id: user.id,
                name: user.name,
                userRole: user.userRole,
                photo: user.photo,
            },
        });
    } catch (e) {
        console.log(e);
        res.send({ message: "Server error" });
    }
};
