# grunt-text-include

> The best grunt plugin ever.

Include simple text resources such as HTML snippets as strings in your project. I use Handlebars and grunt-contrib-handlebars for my templates, but for parameterless templates you can use this. Read a folder of HTML files and this plugin will output a .js file which contains an object with filenames as keys and contents as values.

## Getting Started
_If you haven't used [grunt][] before, be sure to check out the [Getting Started][] guide._

From the same directory as your project's [Gruntfile][Getting Started] and [package.json][], install this plugin with the following command:

```bash
npm install grunt-text-include --save-dev
```

Once that's done, add this line to your project's Gruntfile:

```js
grunt.loadNpmTasks('grunt-text-include');
```

If the plugin has been installed correctly, running `grunt --help` at the command line should list the newly-installed plugin's task or tasks. In addition, the plugin should be listed in package.json as a `devDependency`, which ensures that it will be installed whenever the `npm install` command is run.

[grunt]: http://gruntjs.com/
[Getting Started]: https://github.com/gruntjs/grunt/blob/devel/docs/getting_started.md
[package.json]: https://npmjs.org/doc/json.html

You may also want to use grunt watch:
```js
watch: {
            options: {
                atBegin: true
            },
            text_include: {
                files: ['app/templates/*.html'],
                tasks: ['text_include']
            },
            handlebars: {
                files: ['app/templates/*.hbs'],
                tasks: ['handlebars']
            }
        }
```

## The "text_include" task

### Overview
In your project's Gruntfile, add a section named `text_include` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  text_include: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### options.namespace
Type: `String`
Default value: `Templates`

Name of the global object which contains the strings. Assigned as `this["Templates"] = {...}`

#### options.processName
Type: `Function {String -> String}`
Default value: identity

A function which takes the filename and returns the key this file should have.

### Usage Examples

#### Default Options
In this example, the default options are used to import two text files. So if the `testing.html` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result would be the object `Templates`:

```js
{
    'src/testing.html': 'Testing',
    'src/123': '1 2 3'
}
```

```js
grunt.initConfig({
  text_include: {
    options: {},
    files: {
      'dest/default_templates.js': ['src/testing', 'src/123'],
    },
  },
})
```

#### Custom Options
In this example, custom options are used to make the keys friendlier and append something to the content. So if the app/templates folder contains two html files: `testing.html` file has the content `Testing` and the `hello-there.html` file had the content `Hello\n\nthere`, the generated result in this case would be the following $T object:

```js
{
    testing: 'Testing - app/templates/testing.html',
    helloThere: 'Hello\n\nthere - app/templates/hello-there.html'
}
```

```js
grunt.initConfig({
  text_include: {
    options: {
      namespace: '$T',
      processContent: function(fileContent, filePath) {
        return fileContent + ' - ' + filePath
      },
      processName: function (filePath) {
           return filePath.replace(/^app\/templates\//, '').replace(/\.html$/, '').replace(/-(\w)/g, function (match, letter) {
               return letter.toUpperCase();
           });
       }
    },
    files: {
      'dest/templates.js': ['app/templates/*.html'],
    },
  },
})
```
>See the tests for further examples

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt][].

## Release History
14 April 2014 - First release