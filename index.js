const express = require("express");
const http = require("http");
const fs = require("fs");
const path = require("path");
const connectDB = require("./config/database");
const session = require("express-session");
const morgan = require("morgan");
const MongoStore = require("connect-mongo");
require("dotenv").config();
const { authCheck } = require("./middlewares/AuthMiddleware");
const AuthRoute = require("./routes/AuthRouter");
const {
    clientErrorHandler,
    ErrorHandler,
} = require("./middlewares/errors/HandleErrors");

const LogStream = fs.createWriteStream(path.join(__dirname, "syncwallet.log"), {
    flags: "a",
});

// Create an instance of express
const app = express();

// Connect to database
const db = connectDB();

const port = process.env.PORT || 4000;

// Serve the express app over https
const server = http.createServer(app);

// Register middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("common", { stream: LogStream }));
app.use(express.json());
app.use(
    session({
        secret: process.env.APP_KEY,
        saveUninitialized: true,
        cookie: { maxAge: 1000 * 60 * 60 * 24 },
        resave: false,
        store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    }),
);
if (app.get("env") === "production") {
    app.set("trust proxy", 1);
    // session.cookie.secure = true;
}
app.use(function (req, res, next) {
    res.locals.authenticated = req.session.user ? true : false;
    res.locals.user = req.session.user ? req.session.user : null;
    next();
});
app.use(
    express.urlencoded({
        extended: true,
    }),
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

process.env.NODE_ENV === "development"
    ? app.enable("verbose errors")
    : app.disable("verbose errors");

// application endpoints
app.use("/auth", AuthRoute);
app.get("/", (request, response) => {
    response.render("index", {
        message: "Sync Wallet!",
    });
});

app.get("/dashboard", authCheck, (request, response) => {
    response.render("dashboard");
});

app.get("/error", function (req, res) {
    throw new Error("cfvghnj");
});

// Error handling middlewares
app.use(clientErrorHandler);
app.use(ErrorHandler);

server.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});
