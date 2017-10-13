module.exports = (gulp, path, watch, runSequence) => {

    const browserify = require('browserify');
    const babelify = require('babelify');
    const ngAnnotate = require('browserify-ngannotate');
    const source = require('vinyl-source-stream');
    const notifier = require('node-notifier');

    const src = path.resolve(__dirname, '../../src/angular/app.js');
    const dest = path.resolve(__dirname, '../../src');

    const distDest = path.resolve(__dirname, '../../dist');

    const watchSrc = path.resolve(__dirname, '../../src/angular/**/*.js');

    gulp.task('transpile:webapp:js', (cb) => {
        return browserify(src)
            .transform(babelify, {presets: ["es2015"]})
            .transform(ngAnnotate)
            .bundle()
            .on('error', function (error) {
                console.log(error.message);
                notifier.notify({
                    'title': 'Compile Error',
                    'message': error.message
                });
                this.emit("end");
            })
            .pipe(source('app-bundle.js'))
            .pipe(gulp.dest(dest))
    });

    gulp.task('build:webapp:js', (cb) => {
        return browserify(src)
            .transform(babelify, {presets: ["es2015"]})
            .transform(ngAnnotate)
            .bundle()
            .on('error', function (error) {
                console.log(error.message);
                notifier.notify({
                    'title': 'Compile Error',
                    'message': error.message
                });
                this.emit("end");
            })
            .pipe(source('app-bundle.js'))
            .pipe(gulp.dest(distDest))
    });

    gulp.task('watch:webapp:js', (cb) => {
		watch([watchSrc], () => {
			runSequence('transpile:webapp:js');
		})
	});
}