// This code initializes a Node.js server using the Express framework and configures various middlewares, including session handling with MongoDB and routing.
// Required Modules and Constants:
console.log("Server started");
const http = require("http"); // Core Node.js module to create HTTP server.
const express = require("express"); // Imports the Express framework.
const app = express(); // Creates an instance of an Express application.
const router = require("./router"); // custom routers defined in files
const router_bssr = require("./router_bssr");
const cors = require("cors");
const cookieParser = require("cookie-parser");
// MongoDB Session Store Configuration:
let session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session); // class created to be used in app.use session object middleware
const store = new MongoDBStore({
  // Initializes a new instance of the MongoDB session store, specifying the MongoDB connection URI and the collection name where the sessions will be stored
  // object created from class to:
  uri: process.env.MONGO_URL, // access to MongoDB
  collection: "sessions", // creates a collection in MongoDB with such name
});
// Middleware Configuration. Configures the session middleware:
//1 Entry codes
app.use(express.static("public")); // The server serves static files from the "public" directory, aka takes JSON converts to JS Object
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(express.json()); // The server can parse JSON payloads from incoming requests.
app.use(express.urlencoded({ extended: true })); // The server can parse URL-encoded payloads.
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.use(cookieParser()); // middleware to parse cookies attached to the client request object.
//2 Session codes
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Secret key for session hashing, stored in an environment variable.
    cookie: {
      // properties (1) kamikadze (2) sticky and goes along with req and res objects
      maxAge: 1000 * 60 * 30, // Cookie configuration, set to expire in 30 minutes.
    },
    store: store, // Uses the MongoDB session store defined earlier. used both for saving data and letting connection to mongoDB data
    resave: true, // Forces the session to be saved back to the session store even if the session was never modified during the request.
    saveUninitialized: true, // Forces a session that is "uninitialized" to be saved to the store.
  })
);
// Session to Local Variable:
// Sets the member from the session to the response's local variables. This is useful for making the session data accessible to view templates.
app.use(function (req, res, next) {
  // middleware for assigning user credentials got from restorantController.signupProcess method (req.session.member = new_member(req.body) new_member = await member.signupData i.e multipurpose Member Service controller model)
  res.locals.member = req.session.member; //locals is browser objects where veriables can be stored
  next(); // moves to next logic, works in middlewares
});
//3 View codes (Configures the Express view engine:)
// The integration with views as full-stack application, i.e Express with EJS view engine.
app.set("views", "views"); // Sets the directory for the view templates to "views".
app.set("view engine", "ejs"); // Sets the view engine to "ejs", which is a popular templating engine.
//4 Routing codes (Configures routes:)
app.use("/resto", router_bssr); // Adminka routes
app.use("/", router); // for React FE project

module.exports = app; // This exports the configured app instance, to be used by another module to start the server or for testing purposes.
const server = http.createServer(app);

// Socket.IO Backend Server

const io = require("socket.io")(server, {
  serverClient: false,
  origins: "*:*",
  transport: ["websocket", "xhr-polling"],
});

let online_users = 0;
io.on("connection", function (socket) {
  online_users++;
  console.log("New user, total:", online_users);
  socket.emit("greetMsg", { text: "welcome" });
  io.emit("infoMsg", { total: online_users });

  socket.on("disconnect", function () {
    online_users--;
    socket.broadcast.emit("infoMsg", { total: online_users });
    console.log("client disconnected, total:", online_users);
  });

  socket.on("createMsg", function (data) {
    console.log(data);
    io.emit("newMsg", data);
  });
});

module.exports = server;