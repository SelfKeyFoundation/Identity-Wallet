module.exports = (gulp, path, watch, runSequence) => {
	const pug = require('gulp-pug');
    const templateCache = require('gulp-angular-templatecache');

    const src = path.resolve(__dirname, '../../src/templates/**/*.pug');
    const dest = path.resolve(__dirname, '../../src/angular');

	gulp.task('transpile:webapp:templates', (cb) => {
		gulp.src(src)
			.pipe(pug({client: false}))
			.on('error', function(error) {
				console.log(error);
				this.emit("end");
			})
			.pipe(templateCache({standalone: true, filename: "app.templates.js"}))
			.on('error', function(error) {
				console.log(error);
				this.emit("end");
			})
			.pipe(gulp.dest(dest))
			.on('end', () => {
				cb();
			});
	});
	
	gulp.task('watch:webapp:templates', (cb) => {
		watch([src], () => {
			runSequence('transpile:webapp:templates', 'transpile:webapp:js');
		})
	});
}

