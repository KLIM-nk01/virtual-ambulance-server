const bcrypt = require("bcryptjs");
const { check, validateResult } = require("express-validator");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const config = require("config");

exports.authPost = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
       
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isPassValid = bcrypt.compareSync(password, user.password);
        if (!isPassValid) {
            return res.status(400).json({ message: "Invalid password" });
        }
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
