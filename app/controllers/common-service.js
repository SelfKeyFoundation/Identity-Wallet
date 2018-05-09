'use strict';

const isOnline = require('is-online');

module.exports = (app) => {
    const controller = function () { };

    controller.prototype.isOnline = () => {
        return isOnline()
    }

    return controller;
};
