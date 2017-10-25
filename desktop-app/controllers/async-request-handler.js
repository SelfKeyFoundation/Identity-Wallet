module.exports = function (app) {
    let controller = {};

    controller.checkFileStat = function (event, actionId, actionName, args) {
        try {
            app.modules.fs.stat(args.src, (err, stat) => {
                if(stat){
                    stat.path = args.src;
                }
                app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, err, stat);
            });
        } catch (e) {
            app.win.webContents.send('ON_ASYNC_REQUEST', actionId, actionName, e, null);
        }
    }

    return controller;
}