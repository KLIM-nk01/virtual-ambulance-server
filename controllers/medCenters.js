const medCenterData = require("../public/medCenterData");

exports.medCentersGet = (req, res) => {
    try {
        res.status(200).json(medCenterData);
    } catch (e) {
        console.log(e);
        res.send({ message: e });
    }
};

