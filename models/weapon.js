class Weapon {
    constructor (str) {
        this.str = str
        this._raw = 0;
        this._element = 0;
        this._affinity = 0
    }
    set raw(val) {
        this._raw = val
    }
    get raw() {
        return this._raw
    }
    set affinity(val) {
        this._affinity = val
        if (this._affinity >= 100) {
            this._affinity = 100
        }
    }
    get affinity() {
        return this._affinity
    }    
}

export { Weapon }