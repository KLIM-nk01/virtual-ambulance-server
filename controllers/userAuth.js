const User = require("../models/User");
const jwt = require("jsonwebtoken");
const config = require("config");

exports.userAuthGet = async (req, res) => {
    try {
        const user = await User.findOne({id: req.user.id})
        const token = jwt.sign({ id: user.id }, config.get("secretKey"), {
            expiresIn: "1h",
        });
        return res.status(200).send({
            token,
            user: {
                id_user: user.id,
                name: user.name,
                userRole: user.userRole,
            },
        });
    } catch (e) {
        console.log(e);
        res.send({ message: "Server error" });
    }
};
 