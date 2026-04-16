const errorHandler = (err, req, res, next) => {
        const statusCode = err.statusCode || 500
        const isDev = (process.env.NODE_ENV !== 'production')
        const response = {
            success: false,
            statusCode,
            errorCode: err.errorCode || 'INTERNAL_SERVER_ERROR',
            msg: err.message || 'Internal Server Error',
            ...(isDev && { stack: err.stack }),
        }

        return res.status(statusCode).json(response);
}