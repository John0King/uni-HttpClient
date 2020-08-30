/**
 * 状态码错误
 */
let StatusCodeError = /** @class */ (() => {
    class StatusCodeError extends Error {
        constructor(statusCode, respose) {
            super(StatusCodeError.getMessage(statusCode));
            this.statusCode = statusCode;
            this.respose = respose;
            this.__proto__ = new.target.prototype;
        }
        static getMessage(statusCode) {
            let msg = this.messageMap[200];
            if (msg == null) {
                return statusCode.toString();
            }
            else {
                return `${statusCode} ${msg}`;
            }
        }
        getDisplayMessage() {
            let msg = StatusCodeError.messageMap[this.statusCode];
            if (msg != null) {
                if (msg.display != null) {
                    return msg.display;
                }
                return `${this.statusCode} ${msg.label}`;
            }
            return `${this.statusCode} 未知错误`;
        }
    }
    StatusCodeError.messageMap = {
        200: { label: "OK", },
        201: { label: "Created", display: "创建成功" },
        202: { label: "Accepted", },
        203: { label: "Non-Authoritative Information" },
        204: { label: "No Content" },
        301: { label: "Moved Permanently" },
        302: { label: "Move Temporarily" },
        304: { label: "Not Modified" },
        307: { label: "Temporary Redirect" },
        400: { label: "Bad Request" },
        401: { label: "Unauthorized", display: "您未登录或登录已过期" },
        403: { label: "Forbidden", display: "您没有权限", },
        404: { label: "Not Found", display: "资源不见了", },
        405: { label: "Method Not Allowed" },
        408: { label: "Request Timeout", display: "发送请求超时", },
        500: { label: "Internal Server Error", display: "服务出错了，请稍后再试", },
        502: { label: "Bad Gateway", display: "服务暂不可用，请稍后再试", },
        503: { label: "Service Unavailable", display: "服务暂不可用，请稍后再试", },
        505: { label: "HTTP Version Not Supported" },
    };
    return StatusCodeError;
})();
export { StatusCodeError };
export class CancelError extends Error {
    constructor(message = "Promise Canceled") {
        super(message);
        this.isCancelError = true;
        this.__proto__ = new.target.prototype; // fix an error when downlevel to es5
    }
}
//# sourceMappingURL=errors.js.map