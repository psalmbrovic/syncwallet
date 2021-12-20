const clientErrorHandler = (request, response, next) => {
    response.status(404).response.send("Page not found");
};

const ErrorHandler = (request, response, next) => {
    response.status(500);
    response.send("Page not found");
};

module.exports = { clientErrorHandler, ErrorHandler };
