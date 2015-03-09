# melvin

[![Build Status](http://img.shields.io/travis/jarofghosts/melvin.svg?style=flat)](https://travis-ci.org/jarofghosts/melvin)
[![npm install](http://img.shields.io/npm/dm/melvin.svg?style=flat)](https://www.npmjs.org/package/melvin)

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
  , melvin = require('melvin')

var fileStream = melvin(process.cwd())

fileStream.pipe(through.obj(toUpperCase)).pipe(fileStream)

function toUpperCase(file, x, next) {
  var basename = path.basename(file.filename)

  file.filename = path.resolve(
      process.cwd()
    , '..'
    , 'transformed'
    , basename.toUpperCase()
  )

  file.data = file.data.toString().toUpperCase()

  this.push(file)
}
```

will take any file in the CWD and put it in `../transformed/` with its filename
and contents all upper-cased.

## API

`melvin([sourceDir, ] [dirFilter]) -> Stream`

* `sourceDir` is the directory to read files from. If not provided, no
  directories will be read and the return value will be simply a Writable
  stream. Otherwise, a Duplex stream will be returned.
* `dirFilter` is a function that will be called on every encountered directory
  to determine whether or not to descend into it. If not provided, no recursion
  will occur.

### File Objects

melvin emits File Objects on read, and accepts them on write. They look like
this:

```js
{
    filename: String
  , data: Buffer|String
}
```

* `filename` is the full path to the file
* `data` is a Buffer or String of the contents of said file. (Will always be
  emitted as a Buffer)

### events

melvin emits `written` events with filename whenever it writes a file to disk.

## license

MIT
