'use strict';

const Wallet = requireAppModule('angular/classes/wallet');
const CommonUtils = requireAppModule('angular/classes/common-utils');

function CommonService($rootScope, $log, $q, $mdDialog, $compile, $mdToast) {
    'ngInject';

    $log.debug('CommonService Initialized');

    class CommonService {
        constructor() {
            Wallet.CommonService = this;
            Wallet.$q = $q;
        }

        showToast(type, text, delay, headerText) {
            delay = delay || 3000;

            $mdToast.show({
                hideDelay: delay,
                position: 'top right',
                controller: 'ToastController',
                templateUrl: 'common/toast.html',
                locals: {
                    message: text,
                    type: type,
                    headerText: headerText
                }
            });
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
