const clientErrorHandler = (req, res, next) => {
    res.status(404);
    res.render("errors/404");
};

const ErrorHandler = (err, req, res, next) => {
    res.status(500);
    res.render("errors/500");
};

const ErrorLogger = (err, req, res, next) => {
    // log the error
    next(err);
};

module.exports = { clientErrorHandler, ErrorHandler };
