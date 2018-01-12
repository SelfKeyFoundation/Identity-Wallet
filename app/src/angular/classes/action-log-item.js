'use strict';

import CommonUtils from './common-utils';

let ConfigFileService;

class ActionLogItem {

    static set ConfigFileService(value) { ConfigFileService = value; }

    constructor (id, type, text, subscribtionId) {
        this._id = id || CommonUtils.generateId();
        this.date = new Date();
        this.type = type;
        this.text = text;
    }

    save () {
        return ConfigFileService.save();
    }

}

export default ActionLogItem;