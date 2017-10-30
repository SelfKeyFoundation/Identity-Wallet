'use strict';

import $ from 'jquery';

function AppRun($rootScope, $window, $timeout, $http, $mdDialog, $mdTheming, DICTIONARY, CONFIG, AnimationService, ElectronService, ConfigStorageService, IndexedDBService) {
    'ngInject';

    /**
     * 
     */
    $rootScope.LOCAL_STORAGE_KEYS = CONFIG.constants.localStorageKeys;



    //store1.put({id: 12345, name: {first: "John", last: "Doe"}, age: 42});

    /*
    const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
    let open = indexedDB.open("MyDatabase", 1);

    // Create the schema
    open.onupgradeneeded = function() {
        var db = open.result;
        var store1 = db.createObjectStore("MyObjectStore1", {keyPath: "id"});
        var store2 = db.createObjectStore("MyObjectStore2", {keyPath: "id"});
        var index = store1.createIndex("NameIndex", ["name.last", "name.first"]);
    };

    open.onsuccess = function() {
        // Start a new transaction
        var db = open.result;
        var tx = db.transaction("MyObjectStore1", "readwrite");
        var store1 = tx.objectStore("MyObjectStore1");
        var index = store1.index("NameIndex");

        // Add some data
        store1.put({id: 12345, name: {first: "John", last: "Doe"}, age: 42});
        store1.put({id: 67890, name: {first: "Bob", last: "Smith"}, age: 35});
        
        // Query the data
        var getJohn = store1.get(12345);
        var getBob = index.get(["Smith", "Bob"]);

        getJohn.onsuccess = function() {
            console.log(getJohn.result.name.first);  // => "John"
        };

        getBob.onsuccess = function() {
            console.log(getBob.result.name.first);   // => "Bob"
        };

        // Close the db when the transaction is done
        tx.oncomplete = function() {
            db.close();
        };
    }
    */


    /**
     * 
     */
    AnimationService.init();

    $rootScope.openUrlInNewWindow = function (url) {
        window.open(url)
    }

    $rootScope.test2 = function () {
        window.open("http://token.selfkey.org/");
    }

    $rootScope.test3 = function (event) {
        ElectronService.openUsersDocumentDirectoryChangeDialog(event);
    }

    $timeout(function(){
      $(".sparkley:first").sparkleh();
    }, 2000);

}

export default AppRun;