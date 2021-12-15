const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Token = require("../models/Token");
const config = require("config");
const { updateTokens } = require("../helpers/updateTokens");
const { UNAUTHORIZED } = require("../constants/constants").ERRORS_MESSAGE;
const cookie = require("cookie");

exports.authPost = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "You don't have an account yet. Please register.",
            });
        }

        const isPassValid = bcrypt.compareSync(password, user.password);

        if (!isPassValid) {
            return res.status(400).json({ message: "Invalid password" });
        }

        updateTokens(user.id).then((tokens) => {
            res.setHeader("Set-Cookie", [
                cookie.serialize("token", `${tokens.accessToken}`, {
                    httpOnly: true,
                    maxAge: 60 * 60,
                    path: "/",
                }),

                cookie.serialize("refreshToken", `${tokens.refreshToken}`, {
                    httpOnly: true,
                    maxAge: 60 * 60 * 240,
                    path: "/",
                }),
            ]);

            res.status(200).send({
                user: {
                    id_user: user.id,
                    name: user.name,
                    userRole: user.userRole,
                    photo: user.photo,
                },
            });
        });
    } catch (e) {
        console.log(e);
        res.send({ message: constants.ERRORS_MESSAGE.SERVER_ERROR });
    }
};

exports.refreshTokens = (refreshToken) => {
    const payload = jwt.verify(refreshToken, config.get("secretKey"));

    try {
        if (payload.type !== "refresh") {
            res.status(401).json({ message: UNAUTHORIZED });
            return;
        }
    } catch (e) {
        if (e instanceof jwt.TokenExpiredError) {
            res.status(401).json({ message: UNAUTHORIZED });
            return;
        }
        if (e instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ message: UNAUTHORIZED });
            return;
        }
    }

    Token.findOne({ tokenId: payload.id })
        .exec()
        .then((token) => {
            if (token === null) {
                throw new Error(UNAUTHORIZED);
            }

            return updateTokens(token.userId);
        })
        .then((tokens) => tokens)
        .catch((err) => res.status(400).json({ message: err.message }));
};
