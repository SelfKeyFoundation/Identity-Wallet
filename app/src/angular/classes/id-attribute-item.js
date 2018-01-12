'use strict';

import CommonUtils from './common-utils';
import IdAttributeType from './id-attribute-type';

class IdAttributeItem {

    constructor() {
        this._id = CommonUtils.generateId();

        this.name = null;           // user input
        this.value = null;          // string : static_data or file_path on local machine
        this.contentType = null;    // mimeType in case the value is file_path

        this.idAttributeType = {
            key: null,
            category: null,
            type: null,
            entity: []
        }

        this.addition = {
            selfie: false,
            signature: false,
            notary: false,
            certified_true_copy: false
        }
    }

    setData(data) {
        this._id = data._id;
        this.name = data.name
        this.value = data.value
        this.contentType = data.contentType;
        this.setType(data.idAttributeType);
        if (data.addition) {
            this.setAddition(data.addition);
        }
    }

    setType(type) {
        this.idAttributeType = new IdAttributeType(
            type.key,
            type.category,
            type.type,
            type.entity
        );
    }

    setAddition(addition) {
        this.addition.selfie = addition.selfie;
        this.addition.signature = addition.signature;
        this.addition.notary = addition.notary;
        this.addition.certified_true_copy = addition.certified_true_copy;
    }
}

export default IdAttributeItem;