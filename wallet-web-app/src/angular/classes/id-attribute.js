'use strict';

class IdAttribute {

    constructor () {
        this.key = null;
        this.category = null;
        this.type = null;
        this.entity = [];
        this.defaultItemId = null;
        this.items = {};
    }

    addItem (item) {
        this.items[item._id] = item;
    }

    removeItem (item) {
        delete this.items[item._id];
    }
}

export default IdAttribute;