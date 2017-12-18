'use strict';

import CommonUtils from './common-utils';

class IdAttributeItem {

    constructor () {
        this._id = CommonUtils.generateId();
        this.value = null;
        this.meta = {
            subcategory: null,
            type: null,
            category: null,
            for: {
                company: true,
                individual: true
            }
        };   
    }

}

export default IdAttributeItem;