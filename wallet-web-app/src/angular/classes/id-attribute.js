'use strict';

class IdAttribute {

    /**
     * 
     * @param {*} mainCategory 
     * @param {*} subCategory 
     * @param {*} type 
     * @param {*} targetTypes 
     */
    constructor (mainCategory, subCategory, type, targetTypes) {
        this.mainCategory = mainCategory;
        this.subCategory = subCategory;
        this.type = type;
        this.targetTypes = targetTypes;
    }

}