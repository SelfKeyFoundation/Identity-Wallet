'use strict';

const CommonUtils = requireAppModule('angular/classes/common-utils');
const IdAttributeType = requireAppModule('angular/classes/id-attribute-type');

class IdAttributeItem {

    constructor(item) {
        if (item) {
            this._id = item._id ? item._id : CommonUtils.generateId();
            this.values = item.values;
        } else {
            this._id = CommonUtils.generateId();
            this.values = [];
        }
    }

    addValue(value){
        this.values.push(value)
    }
}

module.exports = IdAttributeItem;