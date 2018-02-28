'use strict';

const electron = require('electron');
const config = require('../config');
const request = require('request');

module.exports = function (app) {

    const AIRTABLE_API = "https://alpha.selfkey.org/marketplace/i/api/";
    const ID_ATTRIBUTE_TABLE = "id-attributes"
    const controller = function () { };

    controller.prototype.loadIdAttributeTypes = () => {
        request.get(AIRTABLE_API + ID_ATTRIBUTE_TABLE, (error, httpResponse, result) => {
            let idAttributesArray = JSON.parse(result).ID_Attributes;
            for (let i in idAttributesArray) {
                if (!idAttributesArray[i].data) continue;
                let item = idAttributesArray[i].data.fields;
                electron.app.sqlLiteService.idAttributeTypes_add(item);
            }
        });

    }

    return controller;
};
