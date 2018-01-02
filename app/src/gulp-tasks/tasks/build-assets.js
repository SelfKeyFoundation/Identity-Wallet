module.exports = (gulp, path, watch, runSequence) => {
    const src = path.resolve(__dirname, '../../src/assets/**/*');
    const dest = path.resolve(__dirname, '../../dist/assets');

	gulp.task('build:webapp:assets', (cb) => {
        gulp.src([src]).pipe(gulp.dest(dest)).on('end', () => { cb(); });
    });
    
    gulp.task('watch:webapp:assets', (cb) => {
        watch([src], () => {
            runSequence('build:webapp:assets');
        });
    });
}