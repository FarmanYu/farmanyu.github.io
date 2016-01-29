---
title: '前端工程化：在gulp中顺序执行任务'
date: 2014-11-01 00:00:00
tags: [gulp,js,frontend]
---

gulp 是前端开发过程中对代码进行构建(Build)的工具，类似于Java世界中的Ant或者Maven。与Ant或Maven类似，在用gulp进行build时，经常需要顺序执行任务：在前一个任务彻底结束后才开始下一个任务。比如，在进行新的一次LESS编译前，首先需要保证删除上一次编译的结果。也即，对于以下两个gulp任务：

``` javascript
    var gulp = require('gulp'),
        less = require('gulp-less'),
        clean = require('gulp-clean');

    gulp.task('compileLESS', function(){
        gulp.src('sample.less')
        .pipe(less())
        .pipe(gulp.dest('sample.css'));
     });

    gulp.task('clean', function(){
        gulp.src('sample.css', { read:false })
        .pipe(clean());
    });
```

必须保证’clean’任务执行完毕后才开始进行’compileLESS’任务。

## gulp中的顺序执行方案
在gulp对任务的定义中(gulp.task)，可以声明任务之间的依赖。比如，可以声明任务’compileLESS’依赖于’clean’:

``` javascript
    gulp.task('compileLESS', ['clean'], function(){
        //compile LESS file...
    });
    gulp.task('clean', function(){
           gulp.src('sample.css', { read:false })
               .pipe(clean());
    });
```

在声明任务依赖后，可以保证’clean’定义的function执行完毕后，’compileLESS’定义的function才开始执行。  
不过，即使定义了任务依赖，对于上述例子我们依然会发现：有时，需要清理的文件尚未删除干净，用于编译的任务就已经开始生成文件了；这在文件较多的项目环境下尤为常见。原因在于，对’clean’定义的function而言，虽然函数本身已经执行完毕了，但是文件删除操作可能仍在进行 — gulp任务中的操作大多数都是数据流(Stream)的操作，其操作进度与函数执行无关。  
如果需要在文件彻底清理后才开始执行’compileLESS’任务，则需要在’clean’任务中进行特殊编码：令其返回最终的数据流(Stream)对象：  

``` javascript
    gulp.task('compileLESS', ['clean'], function(){
        //compile LESS file...
    });
    gulp.task('clean', function(){
        return gulp.src('sample.css', { read:false })
                    .pipe(clean());
    });
```

## 问题根源
应该承认，这样的一种依赖定义方式是不直观的、令人困惑的。然而思考之后会发现，对于这个问题，不能简单的用”bug”来进行总结。  
问题的难点在于：如何在一个任务运行系统中监听数据流的结束？对于数据流而言，代码语句的执行结束仅仅意味着数据操作的开始，唯一能确定数据操作结束的是最后一个数据流所触发的end事件；因此，只有想办法监听到这个end事件，才有可能实现真正意义上的任务依赖。而在任务定义的函数中返回最后一个数据流，是一个相对来说使用起来最方便的方案。  
事实上，gulp中的任务运行系统并不是自己实现的，而是直接使用了 orchestrator 。在gulp的源代码中可以发现，gulp继承了orchestrator，而gulp.task仅仅只是orchestrator.add的别名而已：

``` javascript
    //gulp source code
    var util = require('util');
    var Orchestrator = require('orchestrator');

    function Gulp() {
      Orchestrator.call(this);
    }
    util.inherits(Gulp, Orchestrator);

    Gulp.prototype.task = Gulp.prototype.add;
```

在orchestrator中，解决上述任务依赖的方式有三种：  
1. 在任务定义的function中返回一个数据流，当该数据流的end事件触发时，任务结束。  
2. 在任务定义的function中返回一个promise对象，当该promise对象resolve时，任务结束。  
3. 在任务定义的function中传入callback变量，当callback()执行时，任务结束。  

gulp脚本中可以使用这三种方法来实现任务依赖，不过由于gulp中的任务大多是数据流操作，因此以第一种方法为主。

