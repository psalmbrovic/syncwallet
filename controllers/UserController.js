const User = require("../models/User.js");
const asyncHandler = require("express-async-handler");
const generateToken = require("../middlewares/generateTokens.js");
const crypto = require("crypto");

/**
 * Fetch all users
 * @param {Request} req - Incoming request
 * @param {Response} res - Response
 * @access public
 * @route GET /api/users
 * @returns {Promise<JSON>}
 */

const getUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.find(
            {},
            {
                isAdmin: false,
                _id: false,
                email: false,
                password: false,
                __v: false,
            },
        );
        res.status(200).json(users);
    } catch (error) {
        res.status(500);
        throw new Error("Internal Server Error!");
    }
});

/**
 * Authenticate user & get token
 * @param {Request} req - Incoming request
 * @param {Response} res - Response
 * @access public
 * @route POST /api/users/login
 * @returns {Promise<JSON>}
 */

const authenticateAPIUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (user && (await user.checkPassword(password))) {
        res.json({
            id: user._id,
            email: user.email,
            name: user.name,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error("Invalid Email or Password");
    }
});

/**
 * Register a new user
 * @param {Request} req - Incoming request
 * @param {Response} res - Response
 * @access public
 * @route POST /api/users
 * @returns {Promise<JSON>}
 */

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("User already exists!");
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    if (user) {
        res.status(201);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    }
});

/**
 * Fetch user profile
 * @param {Request} req - Incoming request
 * @param {Response} res - Response
 * @access public
 * @route POST /api/users/profile
 * @returns {Promise<JSON>}
 */

const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            id: user._id,
            email: user.email,
            name: user.name,
        });
    } else {
        res.status(404);
        throw new Error("User Not Found!");
    }
});

/**
 * Update user profile
 * @route PUT /api/users/profile
 * @access private
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<JSON>}
 */
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const { name, email, password } = req.body;

    if (user) {
        user.name = name || user.name;
        user.email = email || user.email;
        if (password) {
            user.password = password || user.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404);
        throw new Error("User Not Found!");
    }
});

const generateURL = () => {
    const regions = [
        "eu-west-1",
        "us-east-1",
        "us-east-2",
        "eu-north-2",
        "apac-2",
    ];
    const region = regions[Math.floor(Math.random() * regions.length)];
    const slug = crypto.randomBytes(8).toString("hex").slice(0, 9);
    const url = `https://${region}.${slug}.syncwallet-hjxrtye.aws.amazon.com`;
    return url;
};

module.exports = {
    getUsers,
    authenticateAPIUser,
    getUserProfile,
    registerUser,
    updateUserProfile,
    generateURL,
};
