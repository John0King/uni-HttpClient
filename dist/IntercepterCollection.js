export class IntercepterCollection extends Array {
    insertBefore(type, value) {
        let index = this.findIndex(x => x instanceof type);
        if (index > 0) {
            this.splice(index, 0, value);
        }
        else {
            this.unshift(value);
        }
    }
    insertAfter(type, value) {
        let index = this.findIndex(x => x instanceof type);
        if (index >= 0) {
            index = index + 1;
            this.splice(index, 0, value);
        }
        else {
            this.push(value);
        }
    }
}
//# sourceMappingURL=IntercepterCollection.js.map