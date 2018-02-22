'use strict';

const electron = require('electron');
const path = require('path');

module.exports = function (app) {

    const controller = function () { };

    controller.prototype.getPrice = (symbol) => {
        // TODO
    }

    controller.prototype.getIcon = (symbol) => {
        // TODO
    }

    return controller;
};
