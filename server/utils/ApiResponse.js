class ApiResponse {
    constructor(success, statusCode, msg, data) {
        this.success = success;
        this.statusCode = statusCode;
        this.message = msg;
        this.data = data;
    }
};

export default ApiResponse;