export class Url {
    constructor(url?: string) {
        if (url == null) {
            return;
        }
        let pos = 0;
        if (url.indexOf('://') > 0) {
            pos = url.indexOf('://');
            this.scheme = url.substr(0, pos);
            pos += 3;

            if (url.indexOf('/', pos + 1) >= 0) {
                this.host = url.substring(pos, url.indexOf('/', pos + 1));
                pos = url.indexOf('/', pos + 1);
            }
            else {
                this.host = url.substring(pos);
                pos = url.length;
            }
        }
        this.pathAndQuery = url.substr(pos);

    }

    /** `http`  or `https` */
    scheme?: string;

    domain?: string | null;
    port?: number | null;
    /** domain + port */
    get host(): string | null {
        let h = this.domain;
        if (this.port != null && !isNaN(this.port)) {
            h = h + ':' + this.port;
        }
        return h ?? null;
    }
    set host(h: string | null) {
        if (h == null) {
            this.domain = null;
            this.port = null;
            return;
        }

        const c = countSymble(h, ':');
        if (c === 1 || h.lastIndexOf(']') >= 0) {
            // [ipv4 or ipv6 or domain] + port
            const pos = h.lastIndexOf(':');
            this.domain = h.substring(0, pos);
            this.port = parseInt(h.substring(pos + 1), 10);
        }
        else {
            // no port
            this.domain = h;
            this.port = null;
        }

        function countSymble(str: string, symble: string): number {
            let pos = 0;
            let ct = 0;
            while (str.indexOf(symble, pos) >= 0) {
                pos = str.indexOf(symble, pos);
                pos += 1;
                ct += 1;
            }
            return ct;
        }
    }
    get pathAndQuery(): string | null {
        if (this.path == null && this.queryString == null) {
            return null;
        }

        return `${this.path ?? ''}${this.queryString ?? ''}`;
    }
    set pathAndQuery(value: string | null) {
        this.parsePathAndQuery(value);
    }
    #path?: string | null;
    get path(): string | null {
        if (this.#path == null || this.#path === '') {
            return null;
        }
        if (!this.#path.startsWith('/')) {
            return `/${this.#path}`;
        }
        return this.#path;
    }
    set path(path: string | null) {
        if (path == null || path === '') {
            this.#path = null;
            return;
        }
        if (!path.startsWith('/')) {
            path = '/' + path;
        }
        this.#path = path;
    }

    get queryString(): string | null {
        if (this.query == null) {
            return null;
        }
        const list = [];
        for (const name in this.query) {
            if (typeof this.query[name] === 'function') {
                continue;
            }
            const kv = [encodeURIComponent(name), encodeURIComponent(this.query[name])].join('=');
            list.push(kv);
        }
        if (list.length === 0) {
            return null;
        }
        return `?${list.join('&')}`;
    }

    set queryString(v: string | null) {
        if (v == null) {
            return;
        }
        this.parseQuery(v);
    }
    query?: Record<string, string | number> | null;

    get hasQuery(): boolean {
        if (this.query != null && Object.getOwnPropertyNames(this.query).length > 0) {
            return true;
        }
        return false;
    }

    get isAbsolute(): boolean {
        return this.scheme != null && this.scheme !== '';
    }

    get isEmpty(): boolean {
        return this.scheme == null && this.host == null && this.pathAndQuery == null;
    }

    get isQuery(): boolean {
        return this.scheme == null && this.host == null && this.path == null && this.hasQuery;
    }

    toString(): string {
        if (this.isAbsolute) {
            return `${this.scheme}://${this.host}${this.path == null && this.hasQuery ? '/' : ''}${this.pathAndQuery ?? ''}`;
        }
        return this.pathAndQuery ?? '';
    }

    private parsePathAndQuery(v: string | null): void {
        if (v == null) {
            this.path = null;
            this.query = null;
            return;
        }
        const pos = v.indexOf('?');
        if (pos >= 0) {
            this.path = v.substring(0, pos);
            this.queryString = v.substring(pos);
        }
        else {
            this.path = v;
        }
    }

    private parseQuery(queryString: string): void {
        if (queryString == null) {
            return;
        }
        if (queryString.startsWith('?')) {
            queryString = queryString.substr(1);
        }
        const kvpair = queryString.split('&');
        if (kvpair.length > 0) {
            this.query = {};
            for (let v of kvpair) {
                const pos = v.indexOf('=');
                if (pos < 0) {
                    return;
                }
                this.query[decodeURIComponent(v.substr(0, pos))] = decodeURIComponent(v.substr(pos + 1));
            }
        }
        else {
            this.query = null;
        }

    }

    /** return a new Url */
    public add(url: Url): Url {
        if (url.isAbsolute) {
            return url.clone();
        }
        if (this.hasQuery) {
            if (url.isQuery) {
                let u = this.clone();
                u.query ??= {};
                for (let name in url.query) {
                    u.query[name] = url.query[name]
                }
                return u;
            }
            else {
                return url.clone();
            }
        }
        else {
            let thisUrl = this.toString();
            let afterUrl = url.toString();
            if (thisUrl.endsWith('/')) {
                thisUrl = thisUrl.substr(0, thisUrl.length - 1);
            }
            if (!afterUrl.startsWith('/')) {
                afterUrl = '/' + afterUrl;
            }
            return new Url(`${this.toString()}${url.toString()}`);
        }
    }

    public clone(): Url {
        return new Url(this.toString());
    }
}
