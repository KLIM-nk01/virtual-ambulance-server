const medCenterData = require("../public/medCenterData");

exports.medCenters_get = (req, res) => {
    try {
        res.status(200).json(medCenterData);
    } catch (e) {
        console.log(e);
        res.send({ message: e });
    }
};

