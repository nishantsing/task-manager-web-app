class CustomError extends Error {
    constructor(message, statusCode) {
        super(message); // invokes constructor of parent class
        this.statusCode = statusCode;
    }
}

const createCustomError = (msg, statusCode) => {
    return new CustomAPIError(msg, statusCode);
};

module.exports = { createCustomError, CustomError };
