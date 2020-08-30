export declare class TokenStorage {
    private tokenType;
    constructor(tokenType: string);
    expireOffsetMs: number;
    private readonly cChar;
    private readonly akey;
    private getKey;
    isTokenExpired(domain: string): boolean;
    getToken(domain: string, includeExpired?: boolean): string | null;
    /**
     * async 允许你挂载 onTokenExpired 钩子函数
     */
    getTokenAsync(domain: string): Promise<string | null | undefined>;
    /**
     * 设置token
     * @param domain 域名， 你可以设置 '*' 但不能是null
     * @param expireIn 秒
     */
    setToken(domain: string, token: string, expireIn: number): void;
    clearToken(domain: string): void;
    onTokenExpired?: (storage: TokenStorage, domain: string) => Promise<void>;
}
export declare const tokenStorage: TokenStorage;
export declare const freshTokenStorage: TokenStorage;
