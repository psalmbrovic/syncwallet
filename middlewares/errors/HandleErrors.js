const clientErrorHandler = (req, res, next) => {
    res.status(404);
    res.render("errors/404");
};

const ErrorHandler = (err, req, res, next) => {
    res.status(500);
    res.render("errors/500");
};

module.exports = { clientErrorHandler, ErrorHandler };
