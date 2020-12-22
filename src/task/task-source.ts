
/**
 * 更优雅的方式设置Promise, (解决Promise 的设计存在问题，无法从外部设置值)
 * 
 */
export class TaskSource<T = any>{

    private resolve!: (value: T) => void;
    private reject!: (reason?: any) => void;


    constructor() {
        this.task = new Promise<T>((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        })
    }

    readonly task: Promise<T>;

    setResult(value: T) {
        this.resolve(value);
    }

    setError(reason?: any) {
        this.reject(reason);
    }

    startAction(action:(task:TaskSource)=>any){
        try{
            action(this);
        }
        catch(e){
            this.setError(e);
        }
    }

}
