var gulp = require('gulp');//引入gulp插件,返回gulp对象。
var html = require('gulp-minify-html');//html压缩插件
var mcss = require('gulp-minify-css');//css压缩插件
var concat = require('gulp-concat');//js合并插件
var uglify = require('gulp-uglify');//js压缩插件
//5.html文件的压缩
gulp.task('runhtml',function(){
	gulp.src('src/*.html')
	.pipe(html())
	.pipe(gulp.dest('dist/src/'));
});
//6.压缩css文件
gulp.task('runcss',function(){
	gulp.src('src/css/*.css')
	.pipe(mcss())
	.pipe(gulp.dest('dist/src/css/'));
});
gulp.task('uglifyjs',function(){
	gulp.src('src/script/js/*.js')//引入路径
	.pipe(concat('all.js'))//执行合并插件并且重新命名合并后的文件
	.pipe(gulp.dest('dist/src/script/js/'))//输出
});