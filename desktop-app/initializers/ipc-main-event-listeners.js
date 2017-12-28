module.exports = {
    run: function (app, next) {
        let path = app.modules.path;

        app.modules.electron.ipcMain.on('ON_CONFIG_CHANGE', (event, userConfig) => {
            console.log('ON_CONFIG_CHANGE', userConfig);
            app.config.user = userConfig
        });

        app.modules.electron.ipcMain.on('ON_ASYNC_REQUEST', (event, actionId, actionName, args) => {
            console.log('ON_ASYNC_REQUEST', actionId, actionName);
            // TODO - check method exists
            app.controllers.asyncRequestHandler[actionName](event, actionId, actionName, args);
        });

        next();
    }
};