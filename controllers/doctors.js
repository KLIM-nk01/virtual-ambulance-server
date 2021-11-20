const Doctor = require("../models/Doctor");
const { SERVER_ERROR } = require("../constants/constants").ERRORS_MESSAGE;

exports.allDoctorsDataGet = async (req, res) => {
    try {
        const doctors = await Doctor.find()
            .populate({
                path: "userData",
            })
            .populate({
                path: "workTime",
            })
            .populate({
                path: "workPlace",
                select: ["name", "address"],
            });

        res.status(200).json(doctors);
    } catch (e) {
        console.log(e);
        res.send({ message: SERVER_ERROR });
    }
};
