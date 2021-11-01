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
const userAuthRoutes = require("./routes/userAuth.routes")
app.use(
    cors({
        origin: "*",
    })
);
app.use(express.json());
app.use(express.static("public"));

app.use("/medCenters", medCentersRoutes);
app.use("/doctors", doctorsRoutes);
app.use("/registration", registrationRoutes);
app.use("/authorization", authorizationRoutes);
app.use("/userAuth", userAuthRoutes)

start = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/virtual-ambulance");

        app.listen(PORT, () => {
            console.log(`Server has been started on port: ${PORT}...`);
        });
    } catch (e) {
        console.log("Server error, error message:", e.message);
        process.exit(1);
    }
};

start();
