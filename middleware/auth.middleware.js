const jwt = require("jsonwebtoken");
const config = require("config");
const Token = require("../models/Token");
const cookie = require("cookie");
const { UNAUTHORIZED, SERVER_ERROR } =
    require("../constants/constants").ERRORS_MESSAGE;

module.exports = async (req, res, next) => {
    if (req.method === "OPTIONS") {
        return next();
    }

    try {
        const token = cookie.parse(req.headers.cookie).token;

        if (!token) {
            res.status(401).json({ message: UNAUTHORIZED });
            return;
        }

        const payload = jwt.verify(token, config.get("secretKey"));

        if (payload.type !== "access") {
            return res.status(500).json({ message: SERVER_ERROR });
        }

        req.user = jwt.verify(token, config.get("secretKey"));
        next();
    } catch (e) {
        if (
            e instanceof jwt.TokenExpiredError ||
            e instanceof jwt.JsonWebTokenError
        ) {
            const refreshToken = cookie.parse(req.headers.cookie).refreshToken;
            if (refreshToken !== "undefined") {
                const decodedRefreshToken = jwt.verify(
                    refreshToken,
                    config.get("secretKey")
                );

                const userIdFromRefreshToken = await Token.findOne({
                    tokenId: decodedRefreshToken.id,
                });

                req.user = {
                    userId: userIdFromRefreshToken.userId,
                };
                next();
                return;
            }
            return;
        }

        res.status(401).json({ message: UNAUTHORIZED });
        return;
    }
};
