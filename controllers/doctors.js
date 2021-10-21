const doctorsData = require("../DataBase/doctorsData");

exports.allDoctorsData_get = (req, res) => {
    res.json(doctorsData);
};
