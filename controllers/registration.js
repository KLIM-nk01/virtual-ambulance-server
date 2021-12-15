const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const MedCenter = require("../models/MedCenter");
const { SERVER_ERROR } = require("../constants/constants").ERRORS_MESSAGE;
const constants = require("../constants/constants");
const { updateTokens } = require("../helpers/updateTokens");
const cookie = require("cookie");

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
            photo: photo === "undefined" ? constants.NO_AVATAR : photo,
            password: hashPassword,
            userRole,
        });

        await user.save();

        if (userRole === constants.USER_ROLE.PATIENT) {
            const patient = new Patient({
                userData: user.id,
                visit: [],
                birthday,
                address,
            });

            await patient.save();
        }

        if (userRole === constants.USER_ROLE.DOCTOR) {
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
                        medStaff: doctor._id,
                    },
                }
            );
        }

        updateTokens(user.id).then((tokens) => {
            res.setHeader("Set-Cookie", [
                cookie.serialize("token", `${tokens.accessToken}`, {
                    httpOnly: true,
                    maxAge: 60 * 60,
                    path: "/",
                }),

                cookie.serialize("refreshToken", `${tokens.refreshToken}`, {
                    httpOnly: true,
                    maxAge: 60 * 60 * 240,
                    path: "/",
                }),
            ]);

            res.status(200).send({
                user: {
                    id_user: user.id,
                    name: user.name,
                    userRole: user.userRole,
                    photo: user.photo,
                },
            });
        });
    } catch (e) {
        console.log(e);
        res.send({ message: SERVER_ERROR });
    }
};
