const User = require("../models/User");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const DateTime = require("../models/DoctorDateTime");

exports.profilePatientGet = async (req, res) => {
    try {
        const patient = await Patient.findOne({
            userData: req.user.id,
        }).populate({
            path: "userData",
        });
        if (patient) {
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
        }
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
            })
            .populate({
                path: "workTime",
            });
        if (doctor) {
            const doctorData = {
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
            res.status(200).json(doctorData);
        }
    } catch (e) {
        console.log(e);
        res.send({ message: "Server error" });
    }
};

exports.profileDoctorAddDatePut = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({
            userData: req.user.id,
        });
        if (doctor) {
            const newDateTime = await new DateTime({
                idDoctor: doctor.id,
                date: req.body.date.split(" ")[0],
                time: req.body.date.split(" ")[1],
            });
            await Doctor.findOneAndUpdate(
                {
                    userData: req.user.id,
                },
                {
                    $push: { workTime: newDateTime.id },
                }
            );
            await newDateTime.save();
            res.json(newDateTime);
        }
    } catch (e) {
        console.log(e);
    }
};

exports.profileDoctorDeleteDataDelete = async (req, res) => {
    try {
        const { idDate } = req.params;
        const user = await Doctor.findOne({
            userData: req.user.id,
            workTime: idDate,
        });
        if (user) {
            await Doctor.findOneAndUpdate(
                {
                    userData: req.user.id,
                },
                {
                    $pullAll: { workTime: [idDate] },
                }
            );
            await DateTime.deleteOne({
                _id: idDate,
            });
            res.status(200).json(idDate);
        }
    } catch (e) {
        console.log(e);
    }
};
