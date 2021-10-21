import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import config from "config";

import medCenterdata from "./DataBase/medCenterData.js";

const PORT = config.get("port") || 3000;
const app = express();

app.use(
    cors({
        origin: "*",
    })
);

app.use(express.static("DataBase"));

app.get("/medCentersPage", (req, res) => {
    res.status(200).json(medCenterdata);
});

async function startServer() {
    try {
        await mongoose.connect('mongodb://localhost:27017/virtual-ambulance');;
        app.listen(PORT, () => {
            console.log(`Server has been started on port: ${PORT}...`);
        });
    } catch (e) {
        console.log("Server error, error message:", e.message);
        process.exit(1);
    }
}

startServer();
