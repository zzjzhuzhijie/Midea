var gulp = require('gulp');//引入gulp插件,返回gulp对象。
var jshint = require('gulp-jshint');//js语法检测插件
var concat = require('gulp-concat');//js合并插件
var uglify = require('gulp-uglify');//js压缩插件
var rename = require('gulp-rename');//js重命名插件
var html = require('gulp-minify-html');//html压缩插件
var mcss = require('gulp-minify-css');//css压缩插件
var imagemin = require('gulp-imagemin');//图片压缩插件
var sass = require('gulp-sass');//sass编译插件
var bable = require('gulp-babel');//sass编译插件
var spritesmith=require('gulp.spritesmith');  

//task:gulp的方法，代表新建一个任务，有两个参数
//参1：任务名，默认是default，一般需要自定义任务名
//参2：回调函数，任务的执行过程。
/*gulp.task('default',function(){
	console.log('hello,gulp');
});*/
//任务的执行：dos--进入目录--通过任务名跑任务。(写法：gulp 任务名)  



//1.代码的复制
gulp.task('copy',function(){
	gulp.src('src/script/js/*.js')
	.pipe(gulp.dest('dist/src/script/js/*.js'));
});


gulp.task('watchcopy',function(){
	gulp.watch('js/*.js',function(){//监听js下面的所有的js文件
		gulp.run('copy');//执行copy任务。
	});
});



//2.js语法错误报告
gulp.task('jshint',function(){
    gulp.src('js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('gulp-jshint-html-reporter', { filename: 'error.html' })); // 输出错误的结果到自定义的html文件
});

//3.js代码的合并：将所有的js代码合并为一个文件
gulp.task('alljs',function(){
	gulp.src('js/*.js')
	.pipe(concat('all.js'))//执行合并插件并且重新命名合并后的文件
	.pipe(gulp.dest('script/'));
});

//4.代码的合并压缩
gulp.task('uglifyjs',function(){
	gulp.src('js/*.js')//引入路径
	.pipe(concat('all.js'))//执行合并插件并且重新命名合并后的文件
	.pipe(gulp.dest('script/'))//输出
	.pipe(rename('all.min.js'))//重命名
	.pipe(uglify())//压缩
	.pipe(gulp.dest('script/'));//输出
});

//监听
gulp.task('watchjs',function(){
	gulp.watch('js.js',function(){
		gulp.run('uglifyjs');
	});
});

//5.html文件的压缩
gulp.task('runhtml',function(){
	gulp.src('index.html')
	.pipe(html())
	.pipe(gulp.dest('html/'));
});
//6.压缩css文件
gulp.task('runcss',function(){
	gulp.src('css/index.css')
	.pipe(mcss())
	.pipe(gulp.dest('style/'));
});

//7.压缩png图片--
gulp.task('runimg',function(){
	gulp.src('img/*')
	.pipe(imagemin())
	.pipe(gulp.dest('images/'));
});

//8.编译sass
gulp.task('runsass',function(){
	gulp.src('sass/*.scss')
	.pipe(sass())
	.pipe(gulp.dest('sasscss/'));
});
gulp.task('watchsass',function(){
	gulp.watch('sass/*.scss',function(){
		gulp.run('runsass');
	});
});


//9.es6转es5
//安装如下插件
//gulp-babel
//gulp-preset-es2015
//babel-core
gulp.task("babeljs", function () {
    gulp.src("js/index.js")  
    .pipe(babel({
     	presets:['es2015']
    }))
    .pipe(gulp.dest("dist/"));  
 });  
gulp.task("watchjs",function(){
    gulp.watch('js/index.js',function(){
    	gulp.run('babeljs');
    });
});

//10.自动刷新
//安装如下插件
//gulp-connect
gulp.task('connect',function(){//新建一个任务
	connect.server({//配置连接服务器
		port:8888,
		livereload:true//自动刷新
	});
});

gulp.task('html',function(){
	gulp.src(['index.html','css/*.css','js/new_file.js'])//引入的文件路径
	.pipe(connect.reload());//自动刷新的方法
});

gulp.task('watch',function(){//监听
	gulp.watch(['index.html','css/*.css','js/new_file.js'],['html']);
});
//执行的任务
gulp.task('default',['connect','watch']);


//11.雪碧图制作插件
//安装gulp.spritesmith插件
gulp.task('sprite',function(){  
    gulp.src('src/images/*.png')  
       .pipe(spritesmith({  
           imgName:'sprite.png',  //imgName为生成图的名称
           cssName:'css/sprite.css', //生成的css文件 
           padding:5,  //表示合成时两个图片的间距
           algorithm:'binary-tree' //algorithm，四个可选值，分别为top-down、left-right、diagonal、alt-diagonal、binary-tree 
       }))  
       .pipe(gulp.dest('dist/'))  
});

