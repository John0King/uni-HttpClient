export class TokenStorage {
    constructor(tokenType) {
        this.tokenType = tokenType;
        this.expireOffsetMs = -5000;
        this.cChar = "#";
        this.akey = "Authentication";
    }
    getKey(domain) {
        return `${this.akey}${this.cChar}${this.tokenType}${this.cChar}${domain}`;
    }
    isTokenExpired(domain) {
        if (domain == null || domain == "") {
            throw new Error("domain can not be null or empty, but you can use '*' ");
        }
        let token = this.getToken(domain);
        return token == null;
    }
    getToken(domain, includeExpired) {
        if (domain == null) {
            throw new Error("domain can not be null or empty, but you can use '*'");
        }
        const key = this.getKey(domain);
        var info = uni.getStorageSync(key);
        if (info == null) {
            return null;
        }
        if (includeExpired !== true) {
            const epTime = info.expireAt + this.expireOffsetMs;
            const epDate = new Date(epTime);
            if (new Date() > epDate) {
                return null;
            }
        }
        return info.token;
    }
    /**
     * async 允许你挂载 onTokenExpired 钩子函数
     */
    getTokenAsync(domain) {
        let t = this.getToken(domain);
        if (t == null) {
            if (this.onTokenExpired != null) {
                return this.onTokenExpired(this, domain)
                    .then(() => this.getToken(domain));
            }
        }
        return new Promise((resove, reject) => {
            resove(this.getToken(domain));
        });
    }
    /**
     * 设置token
     * @param domain 域名， 你可以设置 '*' 但不能是null
     * @param expireIn 秒
     */
    setToken(domain, token, expireIn) {
        if (domain == null) {
            throw new Error("domain can not be null or empty, but you can use '*'");
        }
        const key = this.getKey(domain);
        const cTime = new Date().getTime();
        const eTime = cTime + expireIn * 1000;
        const info = {
            storageAt: cTime,
            expireAt: eTime,
            token: token,
        };
        uni.setStorageSync(key, info);
    }
    clearToken(domain) {
        if (domain == null) {
            throw new Error("domain can not be null or empty, but you can use '*'");
        }
        const key = this.getKey(domain);
        uni.removeStorageSync(key);
    }
}
export const tokenStorage = new TokenStorage("access_token");
export const freshTokenStorage = new TokenStorage("fresh_token");
//# sourceMappingURL=token-storage.js.map