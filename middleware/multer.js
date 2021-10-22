const multer = require("multer");
const moment = require("moment");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cd(null, "../public/userPhoto");
    },
    filename: (req, file, cb) => {
        const date = moment().format("DDMMYYYY");
        cb(null, `${date}-${file.originalname}`);
    },
});

module.export = multer({
    storage: storage,
});
