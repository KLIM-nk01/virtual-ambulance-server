const User = require("../models/User");
const jwt = require("jsonwebtoken");
const config = require("config");

exports.userAuthGet = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.userId });
        const token = jwt.sign({ id: user.userId }, config.get("secretKey"), {
            expiresIn: "1m",
        });
        return res.status(200).send({
            token,
            user: {
                id_user: user.id,
                name: user.name,
                userRole: user.userRole,
                photo: user.photo,
            },
        });
    } catch (e) {
        console.log(e);
        res.send({ message: "Server error" });
    }
};
