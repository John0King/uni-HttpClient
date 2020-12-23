var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var _path;
export class Url {
    constructor(url) {
        _path.set(this, void 0);
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
    /** domain + port */
    get host() {
        let h = this.domain;
        if (this.port != null && !isNaN(this.port)) {
            h = h + ':' + this.port;
        }
        return h !== null && h !== void 0 ? h : null;
    }
    set host(h) {
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
        function countSymble(str, symble) {
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
    get pathAndQuery() {
        var _a, _b;
        if (this.path == null && this.queryString == null) {
            return null;
        }
        return `${(_a = this.path) !== null && _a !== void 0 ? _a : ''}${(_b = this.queryString) !== null && _b !== void 0 ? _b : ''}`;
    }
    set pathAndQuery(value) {
        this.parsePathAndQuery(value);
    }
    get path() {
        if (__classPrivateFieldGet(this, _path) == null || __classPrivateFieldGet(this, _path) === '') {
            return null;
        }
        if (!__classPrivateFieldGet(this, _path).startsWith('/')) {
            return `/${__classPrivateFieldGet(this, _path)}`;
        }
        return __classPrivateFieldGet(this, _path);
    }
    set path(path) {
        if (path == null || path === '') {
            __classPrivateFieldSet(this, _path, null);
            return;
        }
        if (!path.startsWith('/')) {
            path = '/' + path;
        }
        __classPrivateFieldSet(this, _path, path);
    }
    get queryString() {
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
    set queryString(v) {
        if (v == null) {
            return;
        }
        this.parseQuery(v);
    }
    get hasQuery() {
        if (this.query != null && Object.getOwnPropertyNames(this.query).length > 0) {
            return true;
        }
        return false;
    }
    get isAbsolute() {
        return this.scheme != null && this.scheme !== '';
    }
    get isEmpty() {
        return this.scheme == null && this.host == null && this.pathAndQuery == null;
    }
    get isQuery() {
        return this.scheme == null && this.host == null && this.path == null && this.hasQuery;
    }
    toString() {
        var _a, _b;
        if (this.isAbsolute) {
            return `${this.scheme}://${this.host}${this.path == null && this.hasQuery ? '/' : ''}${(_a = this.pathAndQuery) !== null && _a !== void 0 ? _a : ''}`;
        }
        return (_b = this.pathAndQuery) !== null && _b !== void 0 ? _b : '';
    }
    parsePathAndQuery(v) {
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
    parseQuery(queryString) {
        if (queryString == null) {
            return;
        }
        if (queryString.startsWith('?')) {
            queryString = queryString.substr(1);
        }
        const kvpair = queryString.split('&');
        if (kvpair.length > 0) {
            this.query = {};
            for (const v of kvpair) {
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
    add(url) {
        var _a;
        if (url.isAbsolute) {
            return url.clone();
        }
        if (this.hasQuery) {
            if (url.isQuery) {
                const u = this.clone();
                (_a = u.query) !== null && _a !== void 0 ? _a : (u.query = {});
                for (const name in url.query) {
                    if (url.query.hasOwnProperty(name)) {
                        u.query[name] = url.query[name];
                    }
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
            return new Url(`${thisUrl}${afterUrl}`);
        }
    }
    clone() {
        return new Url(this.toString());
    }
}
_path = new WeakMap();
//# sourceMappingURL=url.js.map