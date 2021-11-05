const User = require("../models/User");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");

exports.profilePatientGet = async (req, res) => {
    try {
        const patient = await Patient.findOne({
            userData: req.user.id,
        }).populate({
            path: "userData",
        });
        const userData = {
            name: patient.userData.name,
            lastName: patient.userData.lastName,
            photo: patient.userData.photo,
            phone: patient.userData.phone,
            email: patient.userData.email,
            visit: patient.visit,
            birthday: patient.birthday,
            address: patient.address,
        };

        res.status(200).json(userData);
    } catch (e) {
        console.log(e);
        res.send({ message: "Server error" });
    }
};

exports.profileDoctorGet = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({
            userData: req.user.id,
        })
            .populate({
                path: "userData",
            })
            .populate({
                path: "workPlace",
            });
        const userData = {
            name: doctor.userData.name,
            lastName: doctor.userData.lastName,
            photo: doctor.userData.photo,
            phone: doctor.userData.phone,
            email: doctor.userData.email,
            experience: doctor.experience,
            direction: doctor.direction,
            workPlace: {
                name: doctor.workPlace.name,
                address: doctor.workPlace.address,
            },
            workTime: doctor.workTime,
            patients: doctor.patients,
        };
        res.status(200).json(userData);
    } catch (e) {
        console.log(e);
        res.send({ message: "Server error" });
    }
};
