'use strict';

function CmcSservice($timeout, $log, $http) {

    let loadData = function () {
        var defer = $q.defer();
        $http.get('https://api.coinmarketcap.com/v1/ticker/').then(response => {
            defer.resolve(response);
        }).catch(error => {
            defer.reject(error);
        });
        return defer.promise;
    }


}