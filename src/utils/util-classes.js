class CustomerError extends Error {
    constructor(apiResponse, ...params) {
        super(...params);
        this.apiResponse = apiResponse;
    }
}

class CustomMessage {
    constructor(status, msg) {
        this.status = status;
        this.message = msg;
    }
}


module.exports.CustomMessage = CustomMessage;
module.exports.CustomerError = CustomerError;