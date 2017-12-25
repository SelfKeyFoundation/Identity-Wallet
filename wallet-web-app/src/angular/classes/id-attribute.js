'use strict';

class IdAttribute {

    constructor (key, idAttributeType) {
        this.key = key;
        this.category = idAttributeType.category;
        this.type = idAttributeType.type;
        this.entity = idAttributeType.entity;
        this.defaultItemId = null;
        this.items = {};
    }

    setDefaultItem (item) {
        this.defaultItemId = item._id;
        this.items[item._id] = item;
    }

    addItem (item) {
        this.items[item._id] = item;
    }

    removeItem (item) {
        delete this.items[item._id];
    }
}

export default IdAttribute;