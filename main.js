if (require('electron-squirrel-startup')) return;
// this should be placed at top of main.js to handle setup events quickly

if (handleSquirrelEvent()) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  return;
}

const mv = require('mv');

const { app, BrowserWindow, dialog, remote, ipcMain, ipcRenderer } = require('electron');
const appConfig = require('./config.electron.js');

const EVENTS = appConfig.constants.events;

const fs = require('fs');
const path = require('path');
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
var config;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1000,
    height: 800,
    minWidth: 1000,
    minHeight: 800,
    webPreferences: {
      devTools: true,
      preload: __dirname + '/desktop-app/preload.js'
    },
    icon: path.join(__dirname, 'assets/icons/png/256x256.png')
  });

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'wallet-web-app/dist', 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Open the DevTools.
  win.webContents.openDevTools()

  /**
   * Events
   */
  ipcMain.on(EVENTS.ON_CONFIG_READY, (event, conf) => {
    console.log("ON_CONFIG_READY", conf);
    config = conf
  });

  ipcMain.on("ON_CONFIG_CHANGE", (event, conf) => {
    console.log("ON_CONFIG_CHANGE", conf);
    config = conf;
  });

  ipcMain.on(EVENTS.ON_USER_DOCUMENTS_STORAGE_PATH_CHANGE_REQUEST, (event) => {
    console.log("ON_USER_DOCUMENTS_STORAGE_PATH_CHANGE_REQUEST");

    // TODO - take strings from DICTIONARY
    let dialogConfig = {
      title: "Choose where to save documents",
      message: "Choose where to save documents",
      properties: ['openDirectory']
    };

    dialog.showOpenDialog(win, dialogConfig, (filePaths) => {
      if (filePaths) {
        win.webContents.send(EVENTS.ON_USER_DOCUMENTS_STORAGE_PATH_CHANGE, filePaths[0]);
      }
    });
  });

  ipcMain.on('CHOOSE_FILE_PATH', (event) => {
    // TODO - take strings from DICTIONARY
    let dialogConfig = {
      title: "Choose document",
      message: "Choose document",
      properties: ['openFile']
    };

    dialog.showOpenDialog(win, dialogConfig, (filePaths) => {
      console.log("filePaths", filePaths);
      if (filePaths) {
        win.webContents.send('CHOOSE_FILE_PATH', filePaths[0]);  
      } else {
        win.webContents.send('CHOOSE_FILE_PATH', null);
      }
    });
  });

  ipcMain.on('MOVE_FILE', (event, args) => {
    console.log(args.src, args.dest);
    console.log(path.basename(args.src), "????")
    args.dest += "/" + path.basename(args.src);

    copyFile(args.src, args.dest, (err) => {
      win.webContents.send('MOVE_FILE', err, args.dest);
    });

    /*
    mv(args.src, args.dest, (err) => {
      win.webContents.send('MOVE_FILE', err);  
    });
    */
  });

  // Web Content Ready
  win.webContents.on('did-finish-load', () => {
    // register electron process in webapp
    win.webContents.send(EVENTS.ON_ELECTRON_APP_READY);
  });

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
function handleSquirrelEvent() {
  if (process.argv.length === 1) {
    return false;
  }

  const ChildProcess = require('child_process');
  const path = require('path');

  const appFolder = path.resolve(process.execPath, '..');
  const rootAtomFolder = path.resolve(appFolder, '..');
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  const exeName = "KYC Wallet.exe"; //path.basename(process.execPath);

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

      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-uninstall':
      // Undo anything you did in the --squirrel-install and
      // --squirrel-updated handlers

      // Remove desktop and start menu shortcuts
      spawnUpdate(['--removeShortcut', exeName]);

      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-obsolete':
      // This is called on the outgoing version of your app before
      // we update to the new version - it's the opposite of
      // --squirrel-updated

      app.quit();
      return true;
  }
};

function copyFile(source, target, cb) {
  var cbCalled = false;

  var rd = fs.createReadStream(source);
  rd.on("error", function(err) {
    done(err);
  });
  var wr = fs.createWriteStream(target);
  wr.on("error", function(err) {
    done(err);
  });
  wr.on("close", function(ex) {
    done();
  });
  rd.pipe(wr);

  function done(err) {
    if (!cbCalled) {
      cb(err);
      cbCalled = true;
    }
  }
}
