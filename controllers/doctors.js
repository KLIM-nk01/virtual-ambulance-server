const doctorsData = require("../public/doctorsData");

exports.allDoctorsData_get = (req, res) => {
    res.json(doctorsData);
};
