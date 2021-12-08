const MedCenter = require("../models/MedCenter");
const SERVER_ERROR = require("../constants/constants").ERRORS_MESSAGE;

exports.medCentersGet = async (req, res) => {
    try {
        const medCenters = await MedCenter.find().populate({
            path: "medStaff",
            populate: {
                path: "userData",
            },
        });

        res.status(200).json(medCenters);
    } catch (e) {
        console.log(e);
        res.send({ message: SERVER_ERROR });
    }
};

exports.medCenterGet = async (req, res) => {
    try {
        const { idMedCenter } = req.params;

        const medCenters = await MedCenter.findOne({
            _id: idMedCenter,
        }).populate({
            path: "medStaff",
            populate: {
                path: "userData",
            },
        });

        res.status(200).json([medCenters]);
    } catch (e) {
        console.log(e);
        res.send({ message: SERVER_ERROR });
    }
};

exports.medCentersCreateNewPost = async (req, res) => {
    try {
        const { name, address, description, services, photo } = req.body;
        const medCenter = new MedCenter({
            name,
            address,
            description,
            services: services.split(","),
            photo,
            medStaff: [],
            location: { lat: 0, lon: 0 },
        });
        await medCenter.save();

        res.status(200).send(medCenter);
    } catch (e) {
        console.log(e);
        res.send({ message: SERVER_ERROR });
    }
};

exports.deleteMedCentersCreateNewDelete = async (req, res) => {
    try {
        const { idMedCenter } = req.params;
        const medCenter = await MedCenter.findOne({
            _id: idMedCenter,
        });

        if (medCenter) {
            await MedCenter.deleteOne({
                _id: idMedCenter,
            });
            res.status(200).json(idMedCenter);
        }
    } catch (e) {
        console.log(e);
        res.send({ message: SERVER_ERROR });
    }
};

exports.editMedCenterCreateNewPatch = async (req, res) => {
    try {
        const { _id, name, address, description, services, photo } = req.body;
        const medCenter = await MedCenter.findOne({
            _id: _id,
        });
        await MedCenter.findOneAndUpdate(
            {
                _id: _id,
            },
            {
                $set: {
                    name: name,
                    address: address,
                    description: description,
                    services: services.split(","),
                    photo: photo === "undefined" ? medCenter.photo : photo,
                },
            }
        );
        res.status(200).json({ message: "update" });
    } catch (e) {
        console.log(e);
        res.send({ message: SERVER_ERROR });
    }
};
