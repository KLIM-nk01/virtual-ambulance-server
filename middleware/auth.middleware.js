const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
    if (req.method === "OPTIONS") {
        return next();
    }

    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Token not provided!" });
        }
        const payload = jwt.verify(token, config.get("secretKey"));
        if (payload.type !== "access") {
            return res.status(401).json({ message: "Invalid Token!" });
        }
        const decoded = jwt.verify(token, config.get("secretKey"));
        req.user = decoded;
        next();
    } catch (e) {
        if (e instanceof jwt.TokenExpiredError) {
            res.status(400).json({ message: "Token expired!" });
            return;
        } else if (e instanceof jwt.JsonWebTokenError) {
            res.status(400).json({ message: "Invalid Token!" });
            return;
        }
    }
};
