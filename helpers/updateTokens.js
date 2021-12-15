const authHelper = require("./authHelper");

exports.updateTokens = (userId) => {
    const accessToken = authHelper.generateAccessToken(userId);
    const refreshToken = authHelper.generateRefreshToken();

    return authHelper
        .replaceDbRefreshToken(refreshToken.id, userId)
        .then(() => ({
            accessToken,
            refreshToken: refreshToken.token,
        }));
};
