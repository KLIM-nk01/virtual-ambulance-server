const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const DateTime = require("../models/DoctorDateTime");
const { SERVER_ERROR } = require("../constants/constants").ERRORS_MESSAGE;

exports.profilePatientGet = async (req, res) => {
    try {
        const patient = await Patient.findOne({
            userData: req.user.userId,
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
        res.send({ message: SERVER_ERROR });
    }
};

exports.profileDoctorGet = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({
            userData: req.user.userId,
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
                _id: time._id,
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
        res.send({ message: SERVER_ERROR });
    }
};

exports.profileDoctorAddDatePut = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({
            userData: req.user.userId,
        });

        if (doctor) {
            const newDateTime = await new DateTime({
                doctorData: doctor.id,
                date: req.body.date.split(" ")[0],
                time: req.body.date.split(" ")[1],
            });

            await Doctor.findOneAndUpdate(
                {
                    userData: req.user.userId,
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
        res.send({ message: SERVER_ERROR });
    }
};

exports.profileDoctorDeleteDataDelete = async (req, res) => {
    try {
        const { idDate } = req.params;
        const user = await Doctor.findOne({
            userData: req.user.userId,
            workTime: idDate,
        });

        if (user) {
            await Doctor.findOneAndUpdate(
                {
                    userData: req.user.userId,
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
        res.send({ message: SERVER_ERROR });
    }
};

exports.profilePatientAddAppointmentPut = async (req, res) => {
    try {
        const user = await Patient.findOne({
            userData: req.user.userId,
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
                    userData: req.user.userId,
                },
                {
                    $push: { visit: dateTime.id },
                }
            );

            const doctorWorkTime = await DateTime.findOne({
                _id: req.body.data,
            }).populate({
                path: "doctorData",
                select: ["direction", "workPlace", "userData"],

                populate: [
                    { path: "workPlace", select: ["name", "address"] },
                    { path: "userData", select: ["name", "lastName"] },
                ],
            });

            if (doctorWorkTime) {
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
                    doctorName: doctorWorkTime.doctorData.userData.name,
                    doctorLastName: doctorWorkTime.doctorData.userData.lastName,
                    doctorDirection: doctorWorkTime.doctorData.direction,
                    medCenterName: doctorWorkTime.doctorData.workPlace.name,
                    medCenterAddress:
                        doctorWorkTime.doctorData.workPlace.address,
                    time: doctorWorkTime.time,
                    date: doctorWorkTime.date,
                };

                res.json(response);
            }
        }
    } catch (e) {
        console.log(e);
        res.send({ message: SERVER_ERROR });
    }
};

exports.profilePatientDeleteAppointmentDelete = async (req, res) => {
    try {
        const { idDate } = req.params;
        const user = await Patient.findOne({
            userData: req.user.userId,
            visit: idDate,
        });

        if (user) {
            await Patient.findOneAndUpdate(
                {
                    userData: req.user.userId,
                },
                {
                    $pullAll: { visit: [idDate] },
                }
            );

            await DateTime.findOneAndUpdate(
                {
                    _id: idDate,
                },
                {
                    $unset: {
                        patientData: user.id,
                    },
                }
            );

            res.status(200).json(idDate);
        }
    } catch (e) {
        console.log(e);
        res.send({ message: SERVER_ERROR });
    }
};
