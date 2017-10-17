module.exports = (gulp, path, watch, runSequence) => {

    const reload = require('require-reload')(require);
    const rename = require('gulp-rename');
    const replace = require('gulp-token-replace');

    const env = process.env.NODE_ENV || 'default';

    const configFileSrc = path.resolve(__dirname, '../../../config.json');
    const configAngularTemplateSrc = path.resolve(__dirname, '../../../config.angular-template');
    const configElectronTemplateSrc = path.resolve(__dirname, '../../../config.electron-template');
    
    const dest = path.resolve(__dirname, '../../src/angular/constants/');

	gulp.task('build:webapp:configs', (cb) => {
        let configFileData = reload(configFileSrc);
        gulp
            .src(configAngularTemplateSrc)
            .pipe(rename('app.config.constant.js'))
            .pipe(replace({global: configFileData[env], prefix: '<%', suffix: '%>'}))
            .pipe(gulp.dest(dest))
            .on('end', () => { cb(); });
    });

    gulp.task('build:electron:configs', (cb) => {
        let configFileData = reload(configFileSrc);
        gulp
            .src(configElectronTemplateSrc)
            .pipe(rename('config.electron.js'))
            .pipe(replace({global: configFileData[env], prefix: '<%', suffix: '%>'}))
            .pipe(gulp.dest(path.resolve(__dirname, '../../../')))
            .on('end', () => { cb(); });
    });
    
    gulp.task('watch:webapp:configs', (cb) => {
        watch([configFileSrc, configAngularTemplateSrc], () => {
            runSequence('build:webapp:configs', 'build:electron:configs');
        });
    });

}