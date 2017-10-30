module.exports = function (app) {
    let controller = {};
    let fs = app.modules.fs;

    controller.copyFile = function (source, target, cb) {
        var cbCalled = false;

        var rd = fs.createReadStream(source);
        rd.on('error', function (err) {
            done(err);
        });
        var wr = fs.createWriteStream(target);
        wr.on('error', function (err) {
            done(err);
        });
        wr.on('close', function (ex) {
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

    // TODO
    controller.moveFile = function (source, target, cb) {
        /*
        mv(args.src, args.dest, (err) => {
            win.webContents.send('MOVE_FILE', err);
        });
        */
    }

    controller.getJavaVersion = function (callback) {
        let spawn = require('child_process').spawn('java', ['-version']);

        spawn.on('error', function(err){
            callback(null);
        });
        
        spawn.stderr.on('data', function(data) {
            data = data.toString().split('\n')[0];
            var javaVersion = new RegExp('java version').test(data) ? data.split(' ')[2].replace(/"/g, '') : false;
            if (javaVersion != false) {
                callback(javaVersion);
            } else {
                callback(null);
            }
        });
    }

    return controller;
}