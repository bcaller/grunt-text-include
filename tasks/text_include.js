/*
 * grunt-text-include
 * https://github.com/bcaller/grunt-text-include
 *
 * Copyright (c) 2014 Ben Caller
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('text_include', 'Include text resources as javascript strings', function () {
        var identity = function (content) {
            return content;
        };

        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            namespace: 'Templates',
            processContent: identity,
            processName: identity,
            header: '',
            footer: ''
        });

        var thisTemplate = 'this["' + options.namespace + '"]';

        // Iterate over all specified file groups.
        this.files.forEach(function (f) {
            // Concat specified files.
            var src = thisTemplate + '=' + thisTemplate+ '||{};' +
                f.src.filter(function (filepath) {
                    // Warn on and remove invalid source files (if nonull was set).
                    if (!grunt.file.exists(filepath)) {
                        grunt.log.warn('Source file "' + filepath + '" not found.');
                        return false;
                    }
                    return true;
                }).map(function (filepath) {
                    // Read file source.
                    var content = options.processContent(grunt.file.read(filepath), filepath);
                    var name = options.processName(filepath);
                    content = content.replace(/\n/g,'\\n').replace(/\r/g,'\\r').replace(/\t/g,'\\t').replace(/"/g,'\\"');

                    grunt.log.writeln('Including text file "' + filepath + '" as ' + options.namespace + '["' + name + '"]');

                    return thisTemplate + '[\'' + name + '\']="' + content + '"';
                }).join(';');

            // Write the destination file.
            grunt.file.write(f.dest, options.header + src + ';' + options.footer);

            // Print a success message.
            grunt.log.writeln('File "' + f.dest + '" created.');
        });
    });

};
