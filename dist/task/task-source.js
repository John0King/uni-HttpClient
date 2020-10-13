/**
 * 更优雅的方式设置Promise, (解决Promise 的设计存在问题，无法从外部设置值)
 *
 */
export class TaskSource {
    constructor() {
        this.task = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
    setResult(value) {
        this.resolve(value);
    }
    setError(reason) {
        this.reject(reason);
    }
}
//# sourceMappingURL=task-source.js.map