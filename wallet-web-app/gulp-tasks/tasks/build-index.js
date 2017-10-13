module.exports = (gulp, path, watch, runSequence) => {
    const src = path.resolve(__dirname, '../../src/index.html');
    const dest = path.resolve(__dirname, '../../dist');

	gulp.task('build:webapp:index', (cb) => {
        gulp.src([src]).pipe(gulp.dest(dest)).on('end', () => { cb(); });		
    });
    
    gulp.task('watch:webapp:index', (cb) => {
        watch([src], () => {
            runSequence('build:webapp:index');
        });
    });
}