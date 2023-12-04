const path = require("path"); // Node.js built-in module for handling file paths.
const multer = require("multer"); // Middleware for handling multipart/form-data, mainly used for uploading files.
const uuid = require("uuid"); // Module to create unique identifiers.

/** MULTER IMAGE UPLOADER */
function getTargetImageStorage(address) {
    // This function creates a multer disk storage configuration.
    return multer.diskStorage({
        destination: function (req, file, cb) {
            // where
            cb(null, `./uploads/${address}`); //where to upload (members/community/products) inside the uploads folder.
        },
        filename: function (req, file, cb) {
            // what
            // console.log(file);
            // The original file extension is preserved using the path.parse method. A random filename is generated using uuid.v4(), which ensures that every uploaded file has a unique name
            const extension = path.parse(file.originalname).ext; //parsing file name to get extension
            const random_name = uuid.v4() + extension; // generating random name
            cb(null, random_name);
        },
    });
}

const makeUploader = (address) => {
    // This function returns a multer instance configured with the storage details provided by getTargetImageStorage.
    const storage = getTargetImageStorage(address); // The address argument allows to specify the sub-directory inside the uploads directory where the files should be saved.
    return multer({ storage: storage });
};

// function of this module is to create a multer instance customized to store images to a specific directory with a unique filename.

module.exports = makeUploader;
