module.exports = (gulp, path, watch, runSequence) => {

    const reload = require('require-reload')(require);
    const rename = require('gulp-rename');
    const replace = require('gulp-token-replace');

    const env = process.env.NODE_ENV || 'default';

    const configFileSrc = path.resolve(__dirname, '../../../config.json');
    const configTemplateSrc = path.resolve(__dirname, '../../../config.template');
    
    const dest = path.resolve(__dirname, '../../src/angular/constants/');

	gulp.task('build:webapp:configs', (cb) => {
        let configFileData = reload(configFileSrc);
        gulp
            .src(configTemplateSrc)
            .pipe(rename('app.config.constant.js'))
            .pipe(replace({global: configFileData[env], prefix: '<%', suffix: '%>'}))
            .pipe(gulp.dest(dest))
            .on('end', () => { cb(); });
    });
    
    gulp.task('watch:webapp:configs', (cb) => {
        watch([configFileSrc, configTemplateSrc], () => {
            runSequence('build:webapp:configs');
        });
    });

}