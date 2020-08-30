export class TokenStorage {
    constructor(private tokenType:string){
       
    }
    expireOffsetMs = -5000;
    private readonly cChar = "#";
    private readonly akey = "Authentication";

    private getKey(domain: string) {
        return `${this.akey}${this.cChar}${this.tokenType}${this.cChar}${domain}`;
    }

    isTokenExpired(domain:string){
        if (domain == null || domain == "") {
            throw new Error("domain can not be null or empty, but you can use '*' ");
        }
        let token = this.getToken(domain);
        return token == null;
    }

    getToken(domain: string, includeExpired?: boolean): string | null {
        if (domain == null) {
            throw new Error("domain can not be null or empty, but you can use '*'");
        }
        const key = this.getKey(domain);
        var info = uni.getStorageSync(key) as TokenInfo;
        if(info == null){
            return null;
        }
        if(includeExpired !== true){
            const epTime = info.expireAt + this.expireOffsetMs;
            const epDate = new Date(epTime);
            if(new Date() > epDate){
                return null;
            }
        }
        return info.token;
    }

    /** 
     * async 允许你挂载 onTokenExpired 钩子函数
     */
    getTokenAsync(domain:string):Promise<string|null|undefined>{
        let t = this.getToken(domain);
        if(t == null){
            if(this.onTokenExpired!=null){
                return this.onTokenExpired(this,domain)
                .then(()=>this.getToken(domain));
            }
        }
        return new Promise<string|null>((resove,reject)=>{
            resove(this.getToken(domain));
        })
    }

    /**
     * 设置token
     * @param domain 域名， 你可以设置 '*' 但不能是null
     * @param expireIn 秒
     */
    setToken(domain: string, token: string, expireIn: number) {
        if (domain == null) {
            throw new Error("domain can not be null or empty, but you can use '*'");
        }
        const key = this.getKey(domain);
        const cTime = new Date().getTime();
        const eTime = cTime + expireIn * 1000;
        const info: TokenInfo = {
            storageAt: cTime,
            expireAt: eTime,
            token: token,
        };
        uni.setStorageSync(key, info);
    }

    clearToken(domain:string){
        if (domain == null) {
            throw new Error("domain can not be null or empty, but you can use '*'");
        }
        const key = this.getKey(domain);
        uni.removeStorageSync(key);
    }

    onTokenExpired?: (storage:TokenStorage, domain:string)=>Promise<void>;
}

interface TokenInfo {
    /**ms */
    storageAt: number;
    /**ms */
    expireAt: number;
    token: string;
}

export const tokenStorage = new TokenStorage("access_token");
export const freshTokenStorage = new TokenStorage("fresh_token");
