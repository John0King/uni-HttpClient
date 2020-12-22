export declare class Url {
    #private;
    constructor(url?: string);
    /** `http`  or `https` */
    scheme?: string;
    domain?: string | null;
    port?: number | null;
    /** domain + port */
    get host(): string | null;
    set host(h: string | null);
    get pathAndQuery(): string | null;
    set pathAndQuery(value: string | null);
    get path(): string | null;
    set path(path: string | null);
    get queryString(): string | null;
    set queryString(v: string | null);
    query?: Record<string, string | number> | null;
    get hasQuery(): boolean;
    get isAbsolute(): boolean;
    get isEmpty(): boolean;
    get isQuery(): boolean;
    toString(): string;
    private parsePathAndQuery;
    private parseQuery;
    /** return a new Url */
    add(url: Url): Url;
    clone(): Url;
}
