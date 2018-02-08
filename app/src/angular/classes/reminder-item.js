'use strict';

const CommonUtils = requireAppModule('angular/classes/common-utils');

let ConfigFileService;

class ReminderItem {

    static set ConfigFileService(value) { ConfigFileService = value; }

    constructor (id, type, text, reminderDate) {
        this._id = id || CommonUtils.generateId();
        this.date = new Date();
        this.reminderDate = reminderDate || new Date(new Date().getTime() + (60 * 60 * 1000))
        this.type = 'regular';
        this.text = 'something'
    }

    save () {
        return ConfigFileService.save();
    }

}

module.exports = ReminderItem;