'use strict';

const IdAttributeItem = requireAppModule('angular/classes/id-attribute-item');

class IdAttribute {

    constructor(key) {
        this.key = key;
        this.defaultItemId = null;
        this.items = {};
    }

    init(IdAttribute) {
        this.key = IdAttribute.key;
        this.defaultItemId = IdAttribute.defaultItemId;

        for (let value of IdAttribute.items) {
            value
        }
        this.items = {};
    }

    addItem(itemToAdd) {
        if(!itemToAdd) return;

        if (Object.keys(this.items).length === 0) {
            this.defaultItemId = itemToAdd._id;
        }

        if (itemToAdd instanceof IdAttributeItem) {
            this.items[itemToAdd._id] = itemToAdd;
        } else {
            let item = new IdAttributeItem(itemToAdd);
            this.items[item._id] = item;
        }
    }

    removeItem(item) {
        if(!item || !item._id) return;
        if(this.items[item._id]){
            delete this.items[item._id];
        }
    }
}

module.exports = IdAttribute;