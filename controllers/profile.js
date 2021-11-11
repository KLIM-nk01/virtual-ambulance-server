const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const DateTime = require("../models/DoctorDateTime");

exports.profilePatientGet = async (req, res) => {
    try {
        const patient = await Patient.findOne({
            userData: req.user.id,
        })
            .populate({
                path: "userData",
            })
            .populate({
                path: "visit",
                populate: {
                    path: "doctorData",
                    select: ["direction", "workPlace", "userData"],

                    populate: [
                        { path: "workPlace", select: ["name", "address"] },
                        { path: "userData", select: ["name", "lastName"] },
                    ],
                },
            });
        if (patient) {
            const visits = patient.visit.map((visitItem) => ({
                doctorName: visitItem.doctorData.userData.name,
                doctorLastName: visitItem.doctorData.userData.lastName,
                doctorDirection: visitItem.doctorData.direction,
                medCenterName: visitItem.doctorData.workPlace.name,
                medCenterAddress: visitItem.doctorData.workPlace.address,
                time: visitItem.time,
                date: visitItem.date,
                _idDate: visitItem._id,
            }));

            const userData = {
                name: patient.userData.name,
                lastName: patient.userData.lastName,
                photo: patient.userData.photo,
                phone: patient.userData.phone,
                email: patient.userData.email,
                visit: visits,
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
                populate: {
                    path: "patientData",
                    populate: "userData",
                },
            });
        if (doctor) {
            const workTime = doctor.workTime.map((time) => ({
                doctorData: time.doctorData,
                date: time.date,
                time: time.time,
                patientName: time.patientData?.userData.name,
                patientLastName: time.patientData?.userData.lastName,
                patientPhoto: time.patientData?.userData.photo,
                idWorkTime: time._id,
            }));
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
                workTime: workTime,
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
                doctorData: doctor.id,
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
        res.send({ message: "Server error" });
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
        res.send({ message: "Server error" });
    }
};

exports.profilePatientAddAppointmentPut = async (req, res) => {
    try {
        const user = await Patient.findOne({
            userData: req.user.id,
        });
        const dateTime = await DateTime.findOne({
            _id: req.body.data,
        });

        if (user.visit.indexOf(req.body.data) > -1) {
            return res.status(400).json({
                message: `You already have an appointment at this time.`,
            });
        }
        if (user && dateTime) {
            await Patient.findOneAndUpdate(
                {
                    userData: req.user.id,
                },
                {
                    $push: { visit: dateTime.id },
                }
            );

            const date = await DateTime.findOne({
                _id: req.body.data,
            }).populate({
                path: "doctorData",
                select: ["direction", "workPlace", "userData"],

                populate: [
                    { path: "workPlace", select: ["name", "address"] },
                    { path: "userData", select: ["name", "lastName"] },
                ],
            });
            if (date) {
                await DateTime.findOneAndUpdate(
                    {
                        _id: req.body.data,
                    },
                    {
                        $set: {
                            patientData: user.id,
                        },
                    }
                );
                const response = {
                    doctorName: date.doctorData.userData.name,
                    doctorLastName: date.doctorData.userData.lastName,
                    doctorDirection: date.doctorData.direction,
                    medCenterName: date.doctorData.workPlace.name,
                    medCenterAddress: date.doctorData.workPlace.address,
                    time: date.time,
                    date: date.date,
                };

                res.json(response);
            }
        }
    } catch (e) {
        console.log(e);
        res.send({ message: "Server error" });
    }
};
exports.profilePatientDeleteAppointmentDelete = async (req, res) => {
    try {
        const { idDate } = req.params;
        const user = await Patient.findOne({
            userData: req.user.id,
            visit: idDate,
        });
        if (user) {
            await Patient.findOneAndUpdate(
                {
                    userData: req.user.id,
                },
                {
                    $pullAll: { visit: [idDate] },
                }
            );

            const a = await DateTime.findOneAndUpdate(
                {
                    _id: idDate,
                },
                {
                    $unset: { patientData: req.user.id },
                }
            );
            console.log(a);
            res.status(200).json(idDate);
        }
    } catch (e) {
        console.log(e);
        res.send({ message: "Server error" });
    }
};
