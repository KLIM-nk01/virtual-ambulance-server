const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Token = require("../models/Token");
const config = require("config");
const { updateTokens } = require("../helpers/updateTokens");

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

        updateTokens(user.id).then((tokens) =>
            res.status(200).send({
                tokens,
                user: {
                    id_user: user.id,
                    name: user.name,
                    userRole: user.userRole,
                    photo: user.photo,
                },
            })
        );
    } catch (e) {
        console.log(e);
        res.send({ message: "Server error" });
    }
};

exports.refreshTokens = (refreshToken) => {
    let payload = jwt.verify(refreshToken, config.get("secretKey"));

    try {
        if (payload.type !== "refresh") {
            res.status(400).json({ message: "Invalid Token!" });
            return;
        }
    } catch (e) {
        if (e instanceof jwt.TokenExpiredError) {
            res.status(400).json({ message: "Token expired!" });
            return;
        } else if (e instanceof jwt.JsonWebTokenError) {
            res.status(400).json({ message: "Invalid Token!" });
            return;
        }
    }
    const tok = Token.findOne({ tokenId: payload.id })
        .exec()
        .then((token) => {
            if (token === null) {
                throw new Error("Invalid token");
            }

            return updateTokens(token.userId);
        })
        .then((tokens) => console.log(tokens))
        .catch((err) => res.status(400).json({ message: err.message }));
};
