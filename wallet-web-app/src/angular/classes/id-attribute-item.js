'use strict';

import CommonUtils from './common-utils';

class IdAttributeItem {

    constructor () {
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
            selfie: true, 
            signature: false, 
            notary: false, 
            certified_true_copy: false
        }
    }

    setType (type) {
        this.idAttributeType.key = type.key;
        this.idAttributeType.category = type.category;
        this.idAttributeType.type = type.type;
        this.idAttributeType.entity = type.entity;
    }

    setAddition (selfie, signature, notary, certified_true_copy){
        this.selfie = selfie;
        this.signature = signature;
        this.notary = notary;
        this.certified_true_copy = certified_true_copy;
    }
}

export default IdAttributeItem;