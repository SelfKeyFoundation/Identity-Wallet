'use strict';

const Wallet = requireAppModule('angular/classes/wallet');
const CommonUtils = requireAppModule('angular/classes/common-utils');

function CommonService($rootScope, $log, $q, $mdDialog, $compile) {
  'ngInject';

  $log.debug('CommonService Initialized');

  class CommonService {
    constructor() {
      Wallet.CommonService = this;
      Wallet.$q = $q;
    }

    // targetContainer, type, message, closeAfterMillis, clazz, style
    showMessage(config) {
      let children = [];

      if (config.container) {
        children = config.container.children();
      }

      if (children.length > 0 && config.replace) {
        let el = children[0];

        let spanEl = angular.element(el[0]);

        // TODO
        //console.log(el, spanEl, "<<<<<<");
        //spanEl.innerText = config.message;
        //console.log(config.container, children);
      } else {
        const startFragment = '<sk-message';
        const endFragment = '></sk-message>';
        let middleFrament = ' type="' + config.type + '" message="' + config.message + '"';

        if (config.closeAfter) {
          middleFrament += ' close-after="' + config.closeAfter + '"';
        }
        if (config.clazz) {
          middleFrament += ' class="' + config.clazz + '"';
        }
        if (config.style) {
          middleFrament += ' style="' + config.style + '"';
        }

        let messageHtml = startFragment + middleFrament + endFragment;
        let messageEl = angular.element(messageHtml);

        let messageDir = $compile(messageEl)($rootScope);
        if (!config.container) {
          angular.element(document.body).append(messageDir);
        } else {
          config.container.append(messageDir);
        }
      }
    }

    generateId() {
      let m = Math;
      let d = Date;
      let h = 16;
      let s = s => m.floor(s).toString(h);

      return s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h))
    }

    numbersAfterComma(num, fixed) {
      var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
      return num.toString().match(re)[0];
    }

    chunkArray(myArray, chunkSize) {
      return CommonUtils.chunkArray(myArray, chunkSize);
    }

  }

  return new CommonService();
}

module.exports = CommonService;