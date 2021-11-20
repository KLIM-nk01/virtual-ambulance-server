const User = require("../models/User");
const { updateTokens } = require("../helpers/updateTokens");
const constants = require("../constants/constants");
const cookie = require("cookie");

exports.userAuthGet = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.userId });

        updateTokens(user.id).then((tokens) => {
            res.setHeader("Set-Cookie", [
                cookie.serialize("token", `${tokens.accessToken}`, {
                    httpOnly: true,
                    maxAge: 60 * 60,
                    path: "/",
                }),
                cookie.serialize("refreshToken", `${tokens.refreshToken}`, {
                    httpOnly: true,
                    maxAge: 60 * 60,
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
