module.exports = function (grunt) {
 
    grunt.initConfig({

        pkg: '<json:package.json>',
        meta: {
            banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */'
        },
        dirs: {
            src: 'src',
            dest: 'dist'
        },
        concat: {
            basic: {
                files: [{
                        src: ['<%= dirs.src %>/grunt-demo-1.js', '<%= dirs.src %>/jquery-loader.js'],
                        dest: '<%= dirs.dest %>/gruntDemo1.js'
                    }, {
                        src: ['<%= dirs.src %>/grunt-demo-1.js', '<%= dirs.src %>/jquery-loader.js'],
                        dest: '<%= dirs.dest %>/gruntDemo1-1.js'
                    },
                ]
            },
            plugin: {
                src: ['<%= dirs.src %>/jquery-loader.js'],
                dest: '<%= dirs.dest %>/gruntDemo2.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! 版权所有，这里乱写 */'
            },
            build: {
                src: '<%= concat.basic.files[0].dest %>', //要压缩的源文件，我们也可以用*表示通配，比如'src/*.js'
                dest: 'dst/core.js' //压缩后输出的位置
            },
            dynamic_mappings: {
                // Grunt will search for "**/*.js" under "lib/" when the "minify" task
                // runs and build the appropriate src-dest file mappings then, so you
                // don't need to update the Gruntfile when files are added or removed.
                files: [{
                        expand: true, // Enable dynamic expansion.
                        cwd: 'src/', // Src matches are relative to this path.
                        src: ['**/*.js'], // Actual pattern(s) to match.
                        dest: 'build/', // Destination path prefix.
                        ext: '.min.js', // Dest filepaths will have this extension.
                    },
                ],
            },
        },
        'closure-compiler': {
            
            frontend: {
                closurePath: 'com',
                js: 'src/grunt-demo-1.js',
                jsOutputFile: 'compiler/c.js',
                maxBuffer: 500,
                options: {
                    compilation_level: 'ADVANCED_OPTIMIZATIONS',
                    language_in: 'ECMASCRIPT5_STRICT'
                }
            }
        },
        jshint: {
            all: ['Gruntfile.js', 'src/**/*.js'],
            options:{

            }
        },
        watch:{
            files: ['<%= dirs.src %>/**/*.js'],
            task:['concat']
        },
        clean: {
            foo: {
                src: ['dist/**/*'],
                //filter: 'isFile',
                filter: function(filepath) {
                    return (grunt.file.isDir(filepath) && require('fs').readdirSync(filepath).length === 0);
                },
            },
        },
        log: {
            foo: [1, 2, 3],
            bar: 'hello world',
            baz: false
        },
        log2: {
            concat: {
                basic: {
                    src: ['<%= dirs.src %>/grunt-demo-1.js', '<%= dirs.src %>/jquery-loader.js'],
                    dest: '<%= dirs.dest %>/gruntDemo1.js'
                },
                plugin: {
                    src: ['<%= dirs.src %>/jquery-loader.js'],
                    dest: '<%= dirs.dest %>/gruntDemo2.js'
                }
            },
            uglify: {
                options: {
                    banner: '/*! 版权所有，这里乱写 */'
                },
                build: {
                    src: '<%= concat.basic.dest %>', //要压缩的源文件，我们也可以用*表示通配，比如'src/*.js'
                    dest: 'dst/core.js' //压缩后输出的位置
                }
            },
        }
    });
    grunt.loadTasks("tasks");
   // grunt.loadNpmTasks('grunt-contrib-concat'); //因为tasks中有concat的任务 所以可以不用load
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-closure-compiler');
 
    grunt.registerTask('test',  ['closure-compiler']);//测试 closure-compiler
    grunt.registerTask('dynamic',['uglify']);

    //ranameTask
    grunt.renameTask('test','test2');

    //default
    grunt.registerTask('default', ['concat','uglify','jshint']);

    //mutitask
    grunt.task.registerMultiTask('log2', 'Log stuff.', function() {
        grunt.log.writeln(this.target + ': ' + this.data);
    });

    //function task
    grunt.task.registerTask('foo', 'A sample task that logs stuff.', function(arg1, arg2) {
        if (arguments.length === 0) {
            grunt.log.writeln(this.name + ", no args");
            //当任务一旦完成 立即执行
            grunt.task.run('uglify');
        } else {
            grunt.log.writeln(this.name + ", " + arg1 + " " + arg2);
            grunt.task.run('clean');
        }
    });
    
    //异步
    grunt.registerTask('asyncfoo', 'My "asyncfoo" task.', function() {
        // Force task into async mode and grab a handle to the "done" function.
        var done = this.async();
        // Run some sync stuff.
        grunt.log.writeln('Processing task...'+done);
        // And some async stuff.
        setTimeout(function() {
            grunt.log.writeln('All done!');
            //done();
        }, 3000);
    });
    
    grunt.registerTask('myfoo', 'My "foo" task.', function() {
        grunt.event.emit('myfoo');
        return true;
    });

    grunt.registerTask('mybar', 'My "bar" task.', function() {
        // Fail task if "foo" task failed or never ran.
        grunt.task.requires('myfoo');//依赖其他的任务 返回true 其他的任务才能被执行
        grunt.config.requires("meta");//检测配置属性 如果返回false 则该任务不能成功执行
        // This code executes if the "foo" task ran successfully.
        grunt.log.writeln('Hello, world.');
    });

    grunt.event.on('myfoo',function(){
        console.log(this.event);
    });

    var obj = {
        foo: 'c',
        bar: 'b<%= foo %>d',
        baz: 'a<%= bar %>e'
    };
   var hehe ='';
    grunt.registerTask('template', 'My "bar" task.', function() {
         grunt.template.process('<%= baz %>', {data: obj}); // 'abcde'
        // console.log(grunt.config.get['abcde']);
    });
};
