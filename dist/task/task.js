import { TaskSource } from './task-source';
export class Task {
    /**
     * 延时一段时间
     * @param ms 延时的时间 单位毫秒
     * @param cancelToken  取消令牌
     */
    static delay(ms, cancelToken) {
        let task = new TaskSource();
        setTimeout(() => {
            task.setResult();
        }, ms);
        if (cancelToken) {
            cancelToken.register(x => task.setError(new Error(`delay Canceled`)));
        }
        return task.task;
    }
    /**
     * 等待其中一个@see Promise 完成
     * @param tasks  一个promise 数组
     */
    static whenAny(tasks) {
        if (tasks instanceof Array == false) {
            throw new Error(`parameter must be an array`);
        }
        let task = new TaskSource();
        tasks.forEach(x => x.then(r => task.setResult(x)).catch(e => task.setResult(x)));
        return task.task;
    }
    /**
     * 等待所有的promise完成
     * @param tasks 一个promise 数组
     */
    static whenAll(tasks) {
        if (tasks instanceof Array == false) {
            throw new Error(`parameter must be an array`);
        }
        let task = new TaskSource();
        let count = tasks.length;
        let hasError = false;
        let completedCount = 0;
        function addComplate(error) {
            completedCount++;
            if (completedCount >= count) {
                if (hasError) {
                    task.setError(new Error(`some of the tasks fail`));
                }
                else {
                    task.setResult();
                }
            }
        }
        tasks.forEach(x => {
            x.then(() => addComplate(false))
                .catch(e => addComplate(true));
        });
        return task.task;
    }
    static fromReult(data) {
        let task = new TaskSource();
        task.setResult(data);
        return task.task;
    }
    static fromError(error) {
        let task = new TaskSource();
        task.startAction(x => x.setError(error));
        return task.task;
    }
}
//# sourceMappingURL=task.js.map