/**
 * 更优雅的方式设置Promise, (解决Promise 的设计存在问题，无法从外部设置值)
 *
 */
export declare class TaskSource<T = any> {
    private resolve;
    private reject;
    constructor();
    readonly task: Promise<T>;
    setResult(value: T): void;
    setError(reason?: any): void;
    startAction(action: (task: TaskSource) => any): void;
}
