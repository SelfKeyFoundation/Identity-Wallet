'use strict';

function CommonService($rootScope, $log, $q, $mdDialog, $compile) {
  'ngInject';

  $log.debug('CommonService Initialized');

  class CommonService {
    constructor() { }

    // targetContainer, type, message, closeAfterMillis, clazz, style
    showMessage(config) {
      let children = [];

      if(config.container){
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

  }

  return new CommonService();
}

export default CommonService;