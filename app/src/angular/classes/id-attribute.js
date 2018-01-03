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
        if(Object.keys(this.items).length === 0){
            this.setDefaultItem(item);
        }else{
            this.items[item._id] = item;
        }
    }

    removeItem (item) {
        delete this.items[item._id];
    }
}

export default IdAttribute;