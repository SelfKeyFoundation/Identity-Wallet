module.exports = (gulp, runSequence, watch, path) => {

    const buildStylesheets = require('./tasks/build-stylesheets.js')(gulp, path, watch, runSequence);
    const buildTemplates = require('./tasks/build-templates.js')(gulp, path, watch, runSequence);
    const buildAssets = require('./tasks/build-assets.js')(gulp, path, watch, runSequence);
    const buildConfigs = require('./tasks/build-configs.js')(gulp, path, watch, runSequence);
    const buildJavascripts = require('./tasks/build-javascripts.js')(gulp, path, watch, runSequence);
    const buildIndex = require('./tasks/build-index.js')(gulp, path, watch, runSequence);

    gulp.task('transpile:webapp', (cb) => {
        runSequence(
            'transpile:webapp:stylesheets', 
            'transpile:webapp:templates',
            'build:webapp:configs',
            'transpile:webapp:js'
        , () => {
            cb();
        });
    });

    gulp.task('build:webapp', (cb) => {
        runSequence(
            'build:webapp:stylesheets', 
            'transpile:webapp:templates', 
            'build:webapp:assets',
            'build:webapp:configs',
            'build:webapp:js',
            'build:webapp:index'
        , () => {
            cb();
        });
    });

    gulp.task('watch:webapp', () => {
        runSequence('transpile:webapp', ['watch:webapp:stylesheets', 'watch:webapp:templates', 'watch:webapp:js', 'watch:webapp:configs']);
    });
}
    

