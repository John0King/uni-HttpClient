import { CancelError } from './errors';
import { Task } from './task/task';
import { CancelToken } from './cancel-token';
export class UniRequestHttpClientHander {
    send(request, httpClient) {
        var _a, _b;
        if ((_b = (_a = request.pipeOptions) === null || _a === void 0 ? void 0 : _a.cancelToken) === null || _b === void 0 ? void 0 : _b.isCanceled) {
            return Task.fromError(new CancelToken());
        }
        const p = new Promise((resolve, reject) => {
            var _a, _b;
            let task = uni.request({
                url: request.url,
                method: request.method,
                data: request.data,
                header: request.header,
                responseType: (_a = request.responseType) !== null && _a !== void 0 ? _a : "text",
                success: x => {
                    //     console.log(x);
                    //   if (
                    //     (x.header["content-type"] as string).toLowerCase().indexOf("json") >
                    //     -1
                    //   ) {
                    //     x.data = JSON.parse(x.data!) as any;
                    //   }
                    var _a;
                    // uni api automatic do this for us
                    resolve({
                        header: x.header,
                        statusCode: (_a = x.statusCode) !== null && _a !== void 0 ? _a : 200,
                        data: x.data,
                        httpClient: httpClient,
                        httpClientHander: this,
                        pipeOptions: request.pipeOptions
                    });
                },
                fail: x => {
                    var _a, _b;
                    if ((_b = (_a = request.pipeOptions) === null || _a === void 0 ? void 0 : _a.cancelToken) === null || _b === void 0 ? void 0 : _b.isCanceled) {
                        reject(new CancelError());
                        return;
                    }
                    reject(x);
                }
            });
            if ((_b = request.pipeOptions) === null || _b === void 0 ? void 0 : _b.cancelToken) {
                let cancelToken = request.pipeOptions.cancelToken;
                cancelToken.register(x => task.abort());
            }
        });
        return p;
    }
}
export class UniUploadHttpClientHander {
    send(request, httpClient) {
        var _a, _b;
        if ((_b = (_a = request.pipeOptions) === null || _a === void 0 ? void 0 : _a.cancelToken) === null || _b === void 0 ? void 0 : _b.isCanceled) {
            return Task.fromError(new CancelToken());
        }
        const p = new Promise((resovle, reject) => {
            var _a, _b, _c, _d, _e, _f;
            let task = uni.uploadFile({
                url: request.url,
                files: (_a = request.data) === null || _a === void 0 ? void 0 : _a.files,
                fileType: (_b = request.data) === null || _b === void 0 ? void 0 : _b.fileType,
                filePath: (_c = request.data) === null || _c === void 0 ? void 0 : _c.filePath,
                name: (_d = request.data) === null || _d === void 0 ? void 0 : _d.name,
                header: request.header,
                formData: (_e = request.data) === null || _e === void 0 ? void 0 : _e.formData,
                success: x => {
                    var _a;
                    let data = x.data;
                    let header = {};
                    //let ct = x2.header?.["Content-Type"] as string;
                    try {
                        data = JSON.parse(data);
                        header["Content-Type"] = "application/json";
                    }
                    catch (e) {
                        data = data;
                        // 说明不是json, 操蛋的api没法监测header
                    }
                    resovle({
                        statusCode: (_a = x.statusCode) !== null && _a !== void 0 ? _a : 200,
                        header: header,
                        data: data,
                        httpClient,
                        httpClientHander: this,
                        pipeOptions: request.pipeOptions
                    });
                },
                fail: e => {
                    var _a, _b;
                    if ((_b = (_a = request.pipeOptions) === null || _a === void 0 ? void 0 : _a.cancelToken) === null || _b === void 0 ? void 0 : _b.isCanceled) {
                        reject(new CancelError());
                        return;
                    }
                    reject(e);
                }
            });
            if ((_f = request.pipeOptions) === null || _f === void 0 ? void 0 : _f.cancelToken) {
                let cancelToken = request.pipeOptions.cancelToken;
                cancelToken.register(x => task.abort());
            }
        });
        return p;
    }
}
export class UniDownloadHttpClientHander {
    send(request, httpClient) {
        var _a, _b;
        if ((_b = (_a = request.pipeOptions) === null || _a === void 0 ? void 0 : _a.cancelToken) === null || _b === void 0 ? void 0 : _b.isCanceled) {
            return Task.fromError(new CancelToken());
        }
        const p = new Promise((resolve, reject) => {
            var _a;
            let task = uni.downloadFile({
                url: request.url,
                header: request.header,
                success: res => {
                    var _a, _b;
                    resolve({
                        statusCode: (_a = res.statusCode) !== null && _a !== void 0 ? _a : 200,
                        header: (_b = res.header) !== null && _b !== void 0 ? _b : {},
                        data: res.tempFilePath,
                        httpClientHander: this,
                        httpClient,
                        pipeOptions: request.pipeOptions
                    });
                },
                fail: (e) => {
                    var _a, _b;
                    if ((_b = (_a = request.pipeOptions) === null || _a === void 0 ? void 0 : _a.cancelToken) === null || _b === void 0 ? void 0 : _b.isCanceled) {
                        reject(new CancelError());
                        return;
                    }
                    reject(e);
                }
            });
            if ((_a = request.pipeOptions) === null || _a === void 0 ? void 0 : _a.cancelToken) {
                let cancelToken = request.pipeOptions.cancelToken;
                cancelToken.register(x => task.abort());
            }
        });
        return p;
    }
}
//# sourceMappingURL=httpclien-handler.js.map