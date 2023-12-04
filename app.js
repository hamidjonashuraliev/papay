console.log("Server started");
const express = require("express");
const app = express();
const router = require("./router");
const router_bssr = require("./router_bssr");

let session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const store = new MongoDBStore({
    uri: process.env.MONGO_URL,
    collection: "sessions",
});

//1 Entry codes
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//2 Session codes
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        cookie: {
            maxAge: 1000 * 60 * 30, //for 30 minutes
        },
        store: store,
        resave: true,
        saveUninitialized: true,
    })
);

app.use(function (req, res, next) {
    res.locals.member = req.session.member;
    next();
});

//3 View codes
app.set("views", "views");
app.set("view engine", "ejs");

//4 Routing codes - BSSR
app.use("/resto", router_bssr);
app.use("/", router);

module.exports = app;
