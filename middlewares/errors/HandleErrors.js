const clientErrorHandler = (req, res, next) => {
    res.status(404);
    res.send("Page not found");
};

const ErrorHandler = (req, res, next) => {
    res.status(500);
    res.send("Page not found");
};

module.exports = { clientErrorHandler, ErrorHandler };
