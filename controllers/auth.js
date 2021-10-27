const bcrypt = require("bcryptjs");
const { check, validateResult } = require("express-validator");
const User = require("../models/User");

exports.auth_post = async (req, res) => {
    try {
        // const { email, password } = req.body;
        // const user = await User.findOne({ email });
        // if (!user) {
        //     return res.status(404).json({ message: "User not found" });
        // }
        // const isPassValid = bcrypt.compareSync(password, user.password);
        // if (!isPassValid) {
        //     return res.status(400).json({ message: "Invalid password" });
        // }
    } catch (e) {
        console.log(e);
        res.send({ message: "Server error" });
    }
};
