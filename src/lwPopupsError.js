lwPopups.error = (function () {
    function AbstractFunctionNotImplementedError(message) {
        this.name = "AbstractFunctionNotImplementedError";
        this.message = (message || "Abstract functions must be implemented!");
    }

    AbstractFunctionNotImplementedError.prototype = Error.prototype;

    return {
        AbstractFunctionNotImplementedError : AbstractFunctionNotImplementedError
    };
}());