'use strict';

class IdAttributeType {
    constructor (key, category, type, entity) {
        this.key = key;
        this.category = category;
        this.type = type[0];
        this.entity = entity;
    }
}

export default IdAttributeType;