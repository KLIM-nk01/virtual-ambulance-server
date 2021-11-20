const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("config");
const PORT = config.get("port") || 3000;
const app = express();
const medCentersRoutes = require("./routes/medCenters.routes");
const doctorsRoutes = require("./routes/doctors.routes");
const registrationRoutes = require("./routes/registration.routes");
const authorizationRoutes = require("./routes/auth.routes");
const userAuthRoutes = require("./routes/userAuth.routes");
const profileRoutes = require("./routes/profile.routes");
const cookieParser = require("cookie-parser");

app.use(
    cors({
        origin: "http://localhost:8080",
        preflightContinue: true,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
    })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));
app.use("/medCenters", medCentersRoutes);
app.use("/doctors", doctorsRoutes);
app.use("/registration", registrationRoutes);
app.use("/authorization", authorizationRoutes);
app.use("/userAuth", userAuthRoutes);
app.use("/profile", profileRoutes);

start = async () => {
    try {
        await mongoose.connect(config.get("mongoToken"));
        app.listen(PORT, () => {
            console.log(`Server has been started on port: ${PORT}...`);
        });
    } catch (e) {
        console.log("Server error, error message:", e.message);
        process.exit(1);
    }
};

start();
