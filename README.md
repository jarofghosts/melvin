# melvin

[![Build Status](http://img.shields.io/travis/jarofghosts/melvin.svg?style=flat-square)](https://travis-ci.org/jarofghosts/melvin)
[![npm install](http://img.shields.io/npm/dm/melvin.svg?style=flat-square)](https://www.npmjs.org/package/melvin)
[![npm version](https://img.shields.io/npm/v/melvin.svg?style=flat-square)](https://www.npmjs.org/package/melvin)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard)
[![License](https://img.shields.io/npm/l/melvin.svg?style=flat-square)](https://github.com/jarofghosts/melvin/blob/master/LICENSE)

![Melvin](melvin.jpg)

file mutation stream

## what

a duplex stream interface to mutating directories of files

## why

this module is specifically optimized for use-cases where the fully buffered
file contents are necessary and/or you will be doing lots of file renaming. If
these things are not the case, you might try [mutiny](http://npm.im/mutiny)
instead.

## example

```js
var path = require('path')

var through = require('through2')
var melvin = require('melvin')

var fileStream = melvin(process.cwd())

fileStream.pipe(through.obj(toUpperCase)).pipe(fileStream)

function toUpperCase (file, x, next) {
  var basename = path.basename(file.filename)

  file.filename = path.resolve(
    process.cwd(),
    '..',
    'transformed',
    basename.toUpperCase()
  )

  file.data = file.data.toString().toUpperCase()

  this.push(file)

  next()
}
```

will take any file in the CWD and put it in `../transformed/` with its filename
and contents all upper-cased.

## API

`melvin([sourceDir, ] [dirFilter, ] [fileFilter]) -> Stream`

* `sourceDir` is the directory to read files from. If not provided, no
  directories will be read and the return value will be simply a Writable
  stream. Otherwise, a Duplex stream will be returned.
* `dirFilter` is a function that will be called on every encountered directory
  to determine whether or not to descend into it. If not provided, every
  directory will be recursed into.
* `fileFilter` is a function that will be called with every file encountered
  to determine whether or not to read the file and emit its contents. If not
  provided, every file will be read.

### Notes

* The filter functions must operate synchronously.

### File Objects

melvin emits File Objects on read, and accepts them on write. They look like
this:

```js
{
  filename: String,
  data: Buffer | String
}
```

* `filename` is the full path to the file
* `data` is a Buffer or String of the contents of said file. (Will always be
  emitted as a Buffer)

### events

melvin emits `written` events with filename whenever it writes a file to disk.

## license

MIT
