'use strict';

class IdAttributeType {
    constructor (key, category, type, entity) {
        this.key = key;
        this.category = category;
        this.type = type instanceof Array ? type[0] : type;
        this.entity = entity;
    }
}

export default IdAttributeType;