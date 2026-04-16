class ApiError extends Error {
  constructor(message, statusCode = 500, errorCode = null) {
    super(message);

    this.statusCode = statusCode;
    this.errorCode = errorCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;