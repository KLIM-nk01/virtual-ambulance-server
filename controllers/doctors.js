const doctorsData = require("../public/doctorsData");

exports.allDoctorsDataGet = (req, res) => {
    res.json(doctorsData);
};
