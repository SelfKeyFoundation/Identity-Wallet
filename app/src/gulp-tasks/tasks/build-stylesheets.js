module.exports = (gulp, path, watch, runSequence) => {
    const sass = require("gulp-sass");

    const src = path.resolve(__dirname, '../../src/stylesheets/scss/main.scss');
    const dest = path.resolve(__dirname, '../../src/stylesheets/css');

    const distDest = path.resolve(__dirname, '../../dist/stylesheets/css');

    const watchSrc = path.resolve(__dirname, '../../src/stylesheets/scss/**/*.scss');

    gulp.task('transpile:webapp:stylesheets', (cb) => {
        gulp.src(src)
            .pipe(sass({outputStyle: 'nested'}).on('error', sass.logError))
	        .pipe(gulp.dest(dest))
		    .on('end', () => {
			    cb();
		    });
    });

    gulp.task('build:webapp:stylesheets', (cb) => {
        gulp.src(src)
            .pipe(sass({outputStyle: 'nested'}).on('error', sass.logError))
	        .pipe(gulp.dest(distDest))
		    .on('end', () => {
			    cb();
		    });
    });

    gulp.task('watch:webapp:stylesheets', (cb) => {
        watch([watchSrc], () => {
            runSequence(['transpile:webapp:stylesheets']);
        })
    });
}
    

