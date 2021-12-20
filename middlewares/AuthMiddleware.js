const User = require("../models/User");
const JWT = require("jsonwebtoken");
require("dotenv").config();
const asyncHandler = require("express-async-handler");
const { generateURL } = require("../controllers/UserController");
const nodemailer = require("nodemailer");

/**s
 * Check API users authentication.
 *
 * @param {*} request
 * @param {*} response
 * @param {*} next
 * @returns
 */
const authenticateAPIRequest = async (request, response, next) => {
    let token = null;
    if (
        request.headers.authorization &&
        request.headers.authorization.startswith("Bearer")
    ) {
        try {
            token = request.headers.authorization.split(" ")[1];
            const decoded = JWT.verify(token, process.env.JWT_SECRET);
            request.user = await User.findById(decoded.id, { password: false });
        } catch (error) {
            response.status(401);
            return next();
        }
    }
};

/**
 * Check session users
 *
 * @param {Request} request
 * @param {Response} response
 * @param {Callback} next
 */
const authCheck = (request, response, next) => {
    if (request.session.user) {
        return next();
    }
    request.session.loginError = "Access denied. Login required!";
    request.session.next = request.url;
    response.redirect("/auth/login?next=" + request.session.next);
};

const authenticate = asyncHandler(async (request, response) => {
    const { email, password } = request.body;

    const user = await User.findOne({ email: email });

    if (user && (await user.checkPassword(password))) {
        request.session.regenerate(() => {
            request.session.user = user;
            return response.status(200).json({
                loggedIn: true,
                next: request.session.next,
                email: email,
            });
        });
    } else {
        return response.status(200).json({
            message: "Invalid Email/Password!",
            email: email,
            loggedIn: false,
        });
    }
});

const sendEmail = async (emailAddress) => {
    const transporter = nodemailer.createTransport({
        port: 465,
        host: "smtp.gmail.com",
        auth: {
            user: "youremail@gmail.com",
            pass: "password",
        },
        secure: true,
    });

    const config = {
        from: "hi@syncwallet.co", // sender address
        to: emailAddress, // list of receivers
        subject: "SyncWallet - Welcome",
        text: "Welcome!",
    };

    transporter.sendMail(config, function (error, info) {
        if (error) {
            return;
        }
        return true;
    });
};

const registerUser = asyncHandler(async (request, response) => {
    const { name, email, password } = request.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        response.status(200);
        response.header("Content-Type", "application/json");
        response.json({
            userExists: true,
            userCreated: false,
            message: "User already exists!",
        });
    }
    const controlUrl = generateURL();

    const user = await User.create({
        name: name,
        email: email,
        password: password,
        controlUrl: controlUrl,
    });

    if (user) {
        request.session.user = user;
        response.status(201).json({
            name: user.name,
            email: user.email,
            userCreated: true,
            next: "/dashboard",
        });
    } else {
        response.json({
            message: "An error occured!",
            userCreated: false,
        });
    }
});

const logoutUser = (request, response) => {
    request.session.user = null;
    request.session.destroy(() => {
        response.redirect("/");
    });
};

module.exports = {
    authCheck,
    authenticate,
    registerUser,
    authenticateAPIRequest,
    logoutUser,
};
