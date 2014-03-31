module.exports = function(grunt) {
    var target = 'html';
   // Project configuration.
   grunt.initConfig({
       pkg: grunt.file.readJSON('package.json'),
       connect: {
           server: {
               options: {
                   port: 1509,
                   base: './',
                   open: true,
                   //keepalive: true
               }
           },
           prototype: {
               options: {
                   port: 1508,
                   base: './prototype',
                   open: true,
                   //keepalive: true
               }
           },
       },
       express: {
           prototype: {
               options: {
                   port: 1508,
                   hostname: '0.0.0.0',
                   bases: ['./prototype'],
                   livereload: true
               }
           }
       },
       open: {
           all: {
               // Gets the port from the connect configuration
               path: 'http://localhost:1508'
           }
       },
       clean: {
           release: ['dist/**'],
           prototype: ['prototype/**']
       },
       requirejs: {
           compile: {
               options: {
                   name:'almond',
                   wrap: true,
                   preserveLicenseComments:false,
                   insertRequire: ['main'],
                   baseUrl: 'resources/js/plugins',
                   mainConfigFile: 'resources/js/config.js',
                   out: target+'/dist/js/script.js'
               }
           },
           dev: {
               options: {
                   name:'almond',
                   wrap: true,
                   insertRequire: ['main'],
                   optimize: 'none',
                   preserveLicenseComments:false,
                   generateSourceMaps: true,
                   baseUrl: 'resources/js/plugins',
                   mainConfigFile: 'resources/js/config.js',
                   out: target+'/dist/js/script-debug.js'
               }
           }
       },
       compass: {
           dev: {
               options: {
                   config: 'resources/config.rb',
                   basePath: 'resources',
                   cssDir: '../'+target+'/dist/css',
                   noLineComments: true,
                   outputStyle:'compressed',
                   environment:'production'
               }
           },
           dist: {
               options: {
                   config: 'resources/config.rb',
                   basePath: 'resources',
                   cssDir: '../'+target+'/dist/css',
                   noLineComments: true,
                   outputStyle:'compressed',
                   environment:'production'
               }
           }
       },
       copy: {
           release: {
               files: [
                 {expand: true,
                  cwd: 'resources/',
                  src: ['images/**',
                        'fonts/**',
                        'js/standalone/**'],
                  dest: target +'/dist/', 
                  filter: 'isFile'},
               ]
           },
           prototype: {
               files: [
                 {src: ['resources/css/**',
                        'resources/images/**',
                        'resources/fonts/**',
                        'resources/html/static/**',
                        'resources/js/**'],
                  dest: 'prototype/'},
               ]
           }

       },
       smushit: {
           release: {
               src: 'dist/resources/images'
           }
       },
         imagemin: {                          
            dynamic: {                         
              files: [{
                expand: true,                  // Enable dynamic expansion
                cwd: 'resources/images/',      // Src matches are relative to this path
                src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
                dest: target + '/dist/images'           // Destination path prefix
              }],
               options: {
                        cache: false //Important for a non-failing task process...
                  }
            }
        },
       watch: {
           sass: {
               files: ['resources/sass/**/*.scss'],
               tasks: ['compass:dev'],
           },
           livereload: {
               files: [
                   'resources/css/{,*/}*.css',
                   'resources/js/{,*/}*.js',
                   'resources/images/{,*/}*.{png,jpg,jpeg,gif,webp}'
               ],
               tasks: ['copy:prototype'],
               options: {
                 livereload: true,
               }
           },
           process: {
               files: [
                   './*.html',
                   'html_includes/{,*/}*.html'
               ],
               tasks: ['preprocess:pages'],
           },
           prototype: {
               files: [
                   'prototype/*.html'
               ],
               options: {
                 livereload: true,
               }
           },

       },
       preprocess : {
           pages : {
               files: [
                   {
                       expand: true,
                       cwd: '.',
                       src: ['*.html'],
                       dest: 'prototype/',
                       ext: '.html',
                   },

               ],

           },
           modules : {
               files: [
                   {
                       expand: true,
                       cwd: '.',
                       src: ['*.html'],
                       dest: 'prototype/',
                       ext: '.html',

                   },

               ],

           },
       },
   });

   grunt.loadNpmTasks('grunt-contrib-clean');
   grunt.loadNpmTasks('grunt-contrib-copy');
   grunt.loadNpmTasks('grunt-contrib-requirejs');
   grunt.loadNpmTasks('grunt-contrib-compass');
   grunt.loadNpmTasks('grunt-smushit');
   grunt.loadNpmTasks('grunt-contrib-imagemin');
   grunt.loadNpmTasks('grunt-contrib-connect');
   grunt.loadNpmTasks('grunt-contrib-watch');
   grunt.loadNpmTasks('grunt-preprocess');
   grunt.loadNpmTasks('grunt-express');
   grunt.loadNpmTasks('grunt-open');

   // Default task(s).

   // Build for distribution
   grunt.registerTask('build', ['clean:release','requirejs', 'compass:dist', 'copy:release', 'smushit', 'imagemin']);

   // Run simple server
   grunt.registerTask('server', ['compass:dev', 'connect:server', 'watch']);

   // Run prototype server
   grunt.registerTask('prototype', ['clean:prototype','compass:dev', 'copy:prototype', 'preprocess:modules', 'express:prototype', 'open', 'watch']);

};