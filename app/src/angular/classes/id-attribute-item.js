'use strict';

import CommonUtils from './common-utils';
import IdAttributeType from './id-attribute-type';

class IdAttributeItem {

    constructor(item) {
        if (item) {
            this._id = item._id ? item._id : CommonUtils.generateId();
            this.values = item.values;
            this.fileInfo = item.fileInfo;
        } else {
            this._id = CommonUtils.generateId();
            this.values = [];
        }
    }

}

export default IdAttributeItem;