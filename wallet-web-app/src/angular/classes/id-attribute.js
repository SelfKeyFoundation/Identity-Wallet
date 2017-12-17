'use strict';

class IdAttribute {

    mainCategory = null;    //
    subCategory = null;     //
    type = null;            // document, static-data, etc
    targetTypes = [];       // company, individual

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