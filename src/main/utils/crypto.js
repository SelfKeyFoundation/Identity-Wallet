'use strict';
const crypto = require('crypto');

exports.genRandId = () => crypto.randomBytes(12).toString('hex');
