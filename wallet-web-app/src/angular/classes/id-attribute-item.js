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
}

export default IdAttributeItem;