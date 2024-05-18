const asyncHandler = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (err) {
            next(err); // handled by built in express handler but we can make our custom error handler
        }
    };
};

module.exports = asyncHandler;
