var gulp = require("gulp"),
    load = require("gulp-load-plugins")()

var argv = require('minimist')(process.argv.slice(2));


//LgNEWFe_fJscM8bPeTmtw01triCEfNVm   一个月500张
//-s 文件夹路径
gulp.task('minimg', function() {
    if(argv.s == undefined){
        console.log('请输入文件夹路径,格式为：gulp minimg -s 文件夹路径');
        return false;
    }

    return gulp.src(argv.s + '/**')
        .pipe(load.tinyimg('LgNEWFe_fJscM8bPeTmtw01triCEfNVm'))
        .pipe(gulp.dest(argv.s + 'Done/'));
});



