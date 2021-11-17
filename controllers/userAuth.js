const User = require("../models/User");
const { updateTokens } = require("../helpers/updateTokens");

exports.userAuthGet = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.userId });
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
