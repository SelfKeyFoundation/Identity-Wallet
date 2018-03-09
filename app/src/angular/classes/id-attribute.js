'use strict';

const IdAttributeItem = requireAppModule('angular/classes/id-attribute-item');

class IdAttribute {

    constructor(type) {
        this.type = type;
        this.defaultItemId = null;
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

    setData(data) {
        this._id = data._id;
        this.type = data.type;
        this.defaultItemId = data.defaultItemId;
        for(let itemId in data.items){
            this.addItem(data.items[itemId]);
        }
    }
}

//module.exports = IdAttribute;
