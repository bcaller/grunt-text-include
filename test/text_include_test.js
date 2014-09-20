'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/
var vm = require('vm'), path = require('path');
function getOutput(filename, sandbox, scriptSource) {
    var script = vm.createScript(scriptSource || grunt.file.read(filename));
    var ctx = vm.createContext(sandbox || {});
    script.runInContext(ctx, path.basename(filename));
    return ctx;
}

var fileContents = {
    'one': grunt.file.read('test/fixtures/1.2.3'),
    'testing': grunt.file.read('test/fixtures/testing'),
    'ww': grunt.file.read('test/fixtures/With whitespace')
};

exports.text_include = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  default_options: function(test) {
    test.expect(2);

    var actual = getOutput('tmp/default_options');
    var expected = {
        Templates: {
            'test/fixtures/1.2.3': fileContents.one,
            'test/fixtures/testing': fileContents.testing
        }
    };
    test.deepEqual(actual, expected, 'should make a Templates object with key=filename & value=file content for all source files');

    actual = getOutput('tmp/default_options', { Templates: { x: 1 }});
    expected.Templates.x = 1;
    test.deepEqual(actual, expected, 'should preserve non-conflicting properties to any pre-existing Templates object');


    test.done();
  },
  custom_ns: function(test) {
    test.expect(1);

    var actual = getOutput('tmp/custom_ns');
    var expected = {
        '$T$': {
            'test/fixtures/1.2.3': fileContents.one,
            'test/fixtures/testing': fileContents.testing,
            'test/fixtures/With whitespace': fileContents.ww
        }
    };
    test.deepEqual(actual, expected, 'should have a custom namespace');

    test.done();
  },
  camel_case_name: function(test) {
    test.expect(1);

    var actual = getOutput('tmp/camel_case');
    var expected = {
        Templates: {
            '1.2.3': fileContents.one,
            Testing: fileContents.testing,
            WithWhitespace: fileContents.ww
        }
    };
    test.deepEqual(actual, expected, 'should process filename according to custom function to give the key');

    test.done();
  },
    process_content: function(test) {
        test.expect(1);

        var actual = getOutput('tmp/process_content');
        var expected = {
            Templates: {
                'test/fixtures/1.2.3': '13',
                'test/fixtures/testing': 'Tg',
                'test/fixtures/With whitespace': 'Te'
            }
        };
        test.deepEqual(actual, expected, 'should process content according to custom function');

        test.done();
    },

    remove_excess_white: function(test) {
        test.expect(1);

        var actual = getOutput('tmp/remove_excess_white');
        var expected = {
            Templates: {
                'test/fixtures/1.2.3': fileContents.one,
                'test/fixtures/testing': fileContents.testing,
                'test/fixtures/With whitespace': 'Thisi\tsawesome!'
            }
        };
        test.deepEqual(actual, expected, 'should process content according to custom function');

        test.done();
    },

    header_footer_AMD: function(test) {
        test.expect(1);

        //Add this code to the start of the file when we run it so that define is defined
        var testHarness = 'function define(a, b){return b};this.result=' + grunt.file.read('tmp/header_footer_AMD');
        var actual = getOutput(null, null, testHarness);
        var expected = {
            'test/fixtures/1.2.3': fileContents.one,
            'test/fixtures/testing': fileContents.testing,
            'test/fixtures/With whitespace': fileContents.ww
        };
        //run the function passed in to define()
        test.deepEqual(actual.result(), expected, 'should surround with AMD header and footer');

        test.done();
    },

    header_only: function(test) {
        test.expect(1);

        var actual = getOutput('tmp/header_only');
        var expected = {
            Templates: {
                'test/fixtures/1.2.3': fileContents.one,
                'test/fixtures/testing': fileContents.testing,
                'test/fixtures/With whitespace': fileContents.ww,
                header: true
            }
        };
        test.deepEqual(actual, expected, 'should put header at the top');

        test.done();
    },

    footer_only: function(test) {
        test.expect(1);

        var actual = getOutput('tmp/footer_only');
        var expected = {
            Templates: {
                'test/fixtures/1.2.3': fileContents.one,
                'test/fixtures/testing': fileContents.testing,
                'test/fixtures/With whitespace': fileContents.ww,
                footer: 3
            }
        };
        test.deepEqual(actual, expected, 'should put footer at the bottom');

        test.done();
    }
};
