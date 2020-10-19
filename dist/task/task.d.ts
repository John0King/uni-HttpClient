import { ICancelToken } from '../cancel-token';
export declare class Task {
    /**
     * 延时一段时间
     * @param ms 延时的时间 单位毫秒
     * @param cancelToken  取消令牌
     */
    static delay(ms: number, cancelToken?: ICancelToken): Promise<void>;
    /**
     * 等待其中一个@see Promise 完成
     * @param tasks  一个promise 数组
     */
    static whenAny(tasks: Promise<any>[]): Promise<Promise<any>>;
    /**
     * 等待所有的promise完成
     * @param tasks 一个promise 数组
     */
    static whenAll(tasks: Promise<any>[]): Promise<void>;
    static fromReult<T = any>(data: T): Promise<T>;
    static fromError<T = any>(error: Error | any): Promise<T>;
}
