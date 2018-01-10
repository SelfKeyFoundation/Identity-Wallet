'use strict';

import IdAttributeItem from './id-attribute-item';

class IdAttribute {

    constructor (key, idAttributeType) {
        this.key = key;
        this.category = idAttributeType ? idAttributeType.category : '';
        this.type = idAttributeType ? idAttributeType.type : '';
        this.entity = idAttributeType ? idAttributeType.entity : '';
        this.defaultItemId = null;
        this.items = {};
    }

    setData(data) {
        this.key = data.key;
        this.category = data.category;
        this.type = data.type;
        this.entity = data.entity;
        this.defaultItemId = data.defaultItemId;

        this.items = {};
        for(let i in data.items){
            let item = new IdAttributeItem();
            item.setData(data.items[i]);
            this.items[item._id] = item;
        }
    }

    setDefaultItem (item) {
        this.defaultItemId = item._id;
        this.items[item._id] = item;
    }

    addItem (item) {
        console.log(">>>>", item instanceof IdAttributeItem);
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