const JWT = require("jsonwebtoken");

/**
 * Generate JWT for authorization
 * @param {String} id
 * @returns {String}
 */
const generateToken = (id) => {
    return JWT.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

module.exports = generateToken;
