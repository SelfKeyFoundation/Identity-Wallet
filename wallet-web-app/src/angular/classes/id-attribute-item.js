'use strict';

import CommonUtils from './common-utils';

class IdAttributeItem {

    constructor () {
        this._id = CommonUtils.generateId();
        this.value = null;  // string || object
        this.idAttributeType = {
            key: null,
            category: null,
            type: null,
            entity: []
        }
        /**
         * Item -> date, note, status(????)
         */;
        this.history = []
    }
}

export default IdAttributeItem;