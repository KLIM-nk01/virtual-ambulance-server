exports.registrationUser_post = (req, res) => {
    try {
        console.log(req.body.body);
    } catch (e) {
        console.log(e);
        res.send({ message: "Server error" });
    }
};
