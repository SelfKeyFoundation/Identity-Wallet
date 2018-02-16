'use strict';

const CommonUtils = requireAppModule('angular/classes/common-utils');
const IdAttributeType = requireAppModule('angular/classes/id-attribute-type');

class IdAttributeItem {

    constructor(item) {
        if (item) {
            this._id = item._id ? item._id : CommonUtils.generateId();
            this.values = item.values;
            this.info = item.info;
        } else {
            this._id = CommonUtils.generateId();
            this.values = [];
            this.info = {};
        }
    }

    addValue(value){
        let v = {};
        if(!value._id){
            v._id = CommonUtils.generateId();
            v.value = value;
        }else{
            v = value;
        }
        this.values.push(v);
    }
}

module.exports = IdAttributeItem;
