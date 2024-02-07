// This code sets up a connection to a MongoDB database and starts an HTTP server using the Node.js http module
const http = require("http"); // Core Node.js module to create HTTP server.
const mongoose = require("mongoose"); // Library for MongoDB object modeling for Node.js.
const dotenv = require("dotenv"); // Module to load environment variables from a .env file.
dotenv.config(); // loads the environment variables from a .env file into process.env.

const connectionString = process.env.MONGO_URL; // database name: Papay; Connection string moved to environment file
// This retrieves the MongoDB connection string from the environment variable MONGO_URL.
mongoose.set("strictQuery", false);
mongoose.connect(
    // This code connects to the MongoDB database using the mongoose library. Two options are provided for the connection:
    connectionString,
    { useNewUrlParser: true, useUnifiedTopology: true }, // 1st ensures that the URL string parser is up-to-date with the MongoDB driver.
    // 2nd uses the new topology engine, which removes support for several connection options that are no longer relevant.
    (err, goose) => {
        // If the connection is successful, the callback function is executed.
        if (err) console.log(`Error on connecting to MongoDB`);
        // An error check is done to see if the connection was successful. If there's an error, it's logged to the console.
        else {
            console.log("MongoDB connection successed"); // If there's no error, the code proceeds to require the Express application (./app) and starts an HTTP server.
            // console.log(goose);
            // HTTP Server Creation:
            const server = require("./app"); // The Express application is imported from ./app.

            // const server = http.createServer(app); // An HTTP server is created with the Express application.

            let PORT = process.env.PORT || 3003; // The server listens on a port defined in the environment variable PORT or defaults to 3003 if not specified.
            server.listen(PORT, function () {
                console.log(
                    `server is running on port ${PORT}, http://localhost:${PORT}` // Once the server is running, a log is displayed with the port number.
                );
            });
        }
    }
);

// Remarks:  the script first tries to connect to a MongoDB database. If the connection is successful, it then starts an HTTP server using the Express application from ./app.
