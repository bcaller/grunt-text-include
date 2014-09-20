/*
 * grunt-text-include
 * https://github.com/bcaller/grunt-text-include
 *
 * Copyright (c) 2014 Ben Caller
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    text_include: {
      default_options: {
        options: {
        },
        files: {
          'tmp/default_options': ['test/fixtures/testing', 'test/fixtures/1.2.3']
        }
      },
      custom_ns: {
        options: {
          namespace: '$T$'
        },
        files: {
          'tmp/custom_ns': ['test/fixtures/*']
        }
      },
      camel_case_name: {
        options: {
          processName: function (filePath) {
              return filePath.replace(/^test\/fixtures\//, '').replace(/(?:^|-|\s)(\w)/g, function (match, letter) {
                  return letter.toUpperCase();
              });
          }
        },
        files: {
          'tmp/camel_case': ['test/fixtures/*']
        }
      },
      process_content: {
        options: {
          processContent: function (content, filepath) {
              return content[0] + filepath[filepath.length - 1];
          }
        },
        files: {
          'tmp/process_content': ['test/fixtures/*']
        }
      },
      remove_excess_white: {
        options: {
          processContent: function (content) {
              return content.replace(/\s{4,}/mg, '');
          }
        },
        files: {
          'tmp/remove_excess_white': ['test/fixtures/*']
        }
      },
      header_footer_AMD: {
        options: {
          header: "define([], function () {\n",
          footer: "\nreturn this.Templates;\n});"
        },
        files: {
          'tmp/header_footer_AMD': ['test/fixtures/*']
        }
      },
      header_only: {
        options: {
          header: "this.Templates={'header':true};"
        },
        files: {
          'tmp/header_only': ['test/fixtures/*']
        }
      },
      footer_only: {
        options: {
          footer: "this.Templates.footer=Object.keys(this.Templates).length"
        },
        files: {
          'tmp/footer_only': ['test/fixtures/*']
        }
      }


    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'text_include', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
