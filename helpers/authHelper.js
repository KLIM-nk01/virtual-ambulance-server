const config = require("config");
const uniqid = require("uniqid");
const jwt = require("jsonwebtoken");
const Token = require("../models/Token");

const generateAccessToken = (userId) => {
    const { tokens } = config.get("jwt");
    const payload = {
        userId,
        type: tokens.access.type,
    };
    const options = { expiresIn: tokens.access.expiresIn };

    return jwt.sign(payload, config.get("secretKey"), options);
};

const generateRefreshToken = () => {
    const { tokens } = config.get("jwt");
    const payload = {
        id: uniqid(),
        type: tokens.refresh.type,
    };
    const options = { expiresIn: tokens.refresh.expiresIn };

    return {
        id: payload.id,
        token: jwt.sign(payload, config.get("secretKey"), options),
    };
};

const replaceDbRefreshToken = async (tokenId, userId) => {
    await Token.findOneAndRemove({
        userId,
    });

    await Token.create({ tokenId, userId });
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    replaceDbRefreshToken,
};
