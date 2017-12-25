'use strict';

import CommonUtils from './common-utils';

class IdAttributeItem {

    constructor () {
        this._id = CommonUtils.generateId();
        this.name = null;
        this.value = null;
        this.contentType = null;
        this.idAttributeType = {
            key: null,
            category: null,
            type: null,
            entity: []
        }
    }

    setType(type) {
        this.idAttributeType.key = type.key;
        this.idAttributeType.category = type.category;
        this.idAttributeType.type = type.type;
        this.idAttributeType.entity = type.entity;
    }
}

export default IdAttributeItem;