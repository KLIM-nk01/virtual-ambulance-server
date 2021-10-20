import express from "express";
import path from "path";
import cors from "cors";

const PORT = process.env.PORT || 3000;
const app = express();

import medCenterdata from "./DataBase/medCenterData.js";

app.use(cors());

app.get("/medCentersPage", (req, res) => {
    res.status(200).json(medCenterdata);
});

app.listen(PORT, () => {
    console.log("Server has been started...");
});
