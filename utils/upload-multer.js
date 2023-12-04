const path = require("path");
const multer = require("multer");
const uuid = require("uuid");

/** MULTER IMAGE UPLOADER */
function getTargetImageStorage(address) {
    return multer.diskStorage({
        destination: function (req, file, cb) {
            // where
            cb(null, `./uploads/${address}`); //where to upload (members/community/products)
        },
        filename: function (req, file, cb) {
            // what
            console.log(file);
            const extension = path.parse(file.originalname).ext; //parsing file name to get extension
            const random_name = uuid.v4() + extension; // generating random name
            cb(null, random_name);
        },
    });
}

const makeUploader = (address) => {
    const storage = getTargetImageStorage(address);
    return multer({ storage: storage });
};

module.exports = makeUploader;
