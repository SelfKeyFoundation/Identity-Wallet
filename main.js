if (require('electron-squirrel-startup')) return;

if (handleSquirrelEvent()) {
  return;
}

const fs = require('fs');
const camelCase = require('camelcase');
const lodash = require('lodash');

/**
 * often used modules list
 */
const modules = [
  { 'electron': ['app', 'BrowserWindow', 'dialog', 'remote', 'ipcMain'] },
  'mv',
  'fs',
  'path',
  'url',
  'keythereum'
];

/**
 * initializers list
 */
const initializers = [
  { name: 'electron', enabled: true },
  { name: 'ipc-main-event-listeners', enabled: true }
];

/**
 * shared app instance
 */
let app = {
  dir: {
    root: __dirname,
    desktopApp: __dirname + '/desktop-app'
  },
  config: {
    app: require('./config.electron.js'),
    user: null
  },
  modules: {},
  controllers: {},
  win: {}
};

/**
 * starts app
 */
startApp();

/**
 * 
 */
function startApp() {

  initializeModules();

  buildModulesInFolder(app, app.controllers, app.dir.desktopApp + '/controllers/');

  var modules = loadInitializers(initializers);

  startInitializerChain(app, modules, function (error) {
    if (error) {
      console.log("==========!!!!===========");
      console.log("          ERROR          ");
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!");
      console.log(error);
      console.log("=========================");
    } else {
      console.log("=========================");
      console.log("INITIALIZERS: FINISHED");
      console.log("=========================");
    }
  });
}

function initializeModules() {
  for (var i in modules) {
    if (typeof modules[i] === 'object') {
      for (var j in modules[i]) {
        app.modules[j] = {};
        for (let k in modules[i][j]) {
          app.modules[j][modules[i][j][k]] = require(j)[modules[i][j][k]];
        }
      }
    } else {
      app.modules[modules[i]] = require(modules[i]);
    }
  }
}

function loadInitializers(initializers) {
  var modules = [];

  for (var i in initializers) {
    if (initializers[i].enabled) {
      var module = null;
      var name = initializers[i].name;
      var path = app.dir.desktopApp + '/initializers/';

      module = require(path + name);
      module.name = name;

      modules.push(module);
    }
  }

  return modules;
};

function startInitializerChain(app, initializers, cb) {
  var index = 0;
  startInitializer(app, initializers, index, cb);
};

function startInitializer (app, initializers, index, cb) {
  var initializer = initializers[index];
  if (!initializer) {
    return cb();
  }

  console.log(initializer.name);

  initializer.run(app, function (err) {
    if (err) {
      console.log(err);
      process.exit(1);
    }

    index++;
    startInitializer(app, initializers, index, cb);
  });
};

function handleSquirrelEvent() {
  if (process.argv.length === 1) {
    return false;
  }

  const ChildProcess = require('child_process');
  const path = require('path');

  const appFolder = path.resolve(process.execPath, '..');
  const rootAtomFolder = path.resolve(appFolder, '..');
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  const exeName = 'KYC Wallet.exe'; //path.basename(process.execPath);

  const spawn = function (command, args) {
    let spawnedProcess, error;

    try {
      spawnedProcess = ChildProcess.spawn(command, args, { detached: true });
    } catch (error) { }

    return spawnedProcess;
  };

  const spawnUpdate = function (args) {
    return spawn(updateDotExe, args);
  };

  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
      // Optionally do things such as:
      // - Add your .exe to the PATH
      // - Write to the registry for things like file associations and
      //   explorer context menus

      // Install desktop and start menu shortcuts
      spawnUpdate(['--createShortcut', exeName]);

      setTimeout(app.modules.electron.app.quit, 1000);
      return true;

    case '--squirrel-uninstall':
      // Undo anything you did in the --squirrel-install and
      // --squirrel-updated handlers

      // Remove desktop and start menu shortcuts
      spawnUpdate(['--removeShortcut', exeName]);

      setTimeout(app.modules.electron.app.quit, 1000);
      return true;

    case '--squirrel-obsolete':
      // This is called on the outgoing version of your app before
      // we update to the new version - it's the opposite of
      // --squirrel-updated

      app.modules.electron.app.quit();
      return true;
  }
};

/**
 * Core Function - builds & instantiates js module
 * @param {*} app 
 * @param {*} namespace 
 * @param {*} dir 
 */
function buildModulesInFolder(app, namespace, dir) {
  if (fs.existsSync(dir)) {
    var rootDir = fs.readdirSync(dir);

    if (rootDir && rootDir.length > 0) {
      rootDir.forEach(function (file) {

        var nameParts = file.split('/');
        var name = camelCase(nameParts[(nameParts.length - 1)].split('.')[0]);
        var filePath = dir + file;

        if (fs.lstatSync(filePath).isDirectory()) {
          namespace[name] = {};
          return buildModulesInFolder(app, namespace[name], filePath + '/');
        } else {
          if (fs.existsSync(filePath)) {
            let module = require(filePath);
            namespace[name] = new module(app);
          }
        }
      });
    }
  }
}