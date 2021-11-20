const jwt = require("jsonwebtoken");
const config = require("config");
const Token = require("../models/Token");
const cookie = require("cookie");

module.exports = async (req, res, next) => {
    if (req.method === "OPTIONS") {
        return next();
    }

    try {
        const token = cookie.parse(req.headers.cookie).token;

        if (!token) {
            res.status(401).json({ message: "Unauthorized!" });
            return;
        }
        
        const payload = jwt.verify(token, config.get("secretKey"));

        if (payload.type !== "access") {
            return res.status(500).json({ message: "Server error." });
        }

        const decoded = jwt.verify(token, config.get("secretKey"));
        req.user = decoded;
        next();
    } catch (e) {
        if (e instanceof jwt.TokenExpiredError) {
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
        } else if (e instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ message: "Unauthorized!" });
            return;
        }
    }
};
