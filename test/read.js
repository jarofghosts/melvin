var path = require('path')
  , os = require('os')
  , fs = require('fs')

var mkdirp = require('mkdirp')
  , rimraf = require('rimraf')
  , test = require('tape')

var melvin = require('../')

var tmp = os.tmpdir()

test('lists files with contents in given dir', function(t) {
  t.plan(1)

  var src = path.join(tmp, 'src')

  mkdirp.sync(src)

  fs.writeFileSync(path.join(src, 'file.txt'), 'lol')

  var melvinStream = melvin(src)

  melvinStream.on('data', function(fileObject) {
    t.deepEqual(
        fileObject
      , {
            filename: path.join(src, 'file.txt')
          , data: new Buffer('lol', 'utf8')
        }
    )

    rimraf.sync(src)
  })
})

test('recurses by default', function(t) {
  t.plan(1)

  var src = path.join(tmp, 'src')
  var second = path.join(src, 'second')
  var count = 0

  mkdirp.sync(second)

  fs.writeFileSync(path.join(src, 'file.txt'), 'lol')
  fs.writeFileSync(path.join(second, 'file.bmp'), 'heehaw')

  var melvinStream = melvin(src)

  melvinStream.on('data', function() {
    ++count
  })

  melvinStream.on('end', function() {
    t.equal(count, 2)
    rimraf.sync(src)
  })
})

test('does not recurse if configured not to', function(t) {
  t.plan(2)

  var src = path.join(tmp, 'src')
  var second = path.join(src, 'second')
  var count = 0

  mkdirp.sync(second)

  fs.writeFileSync(path.join(src, 'file.txt'), 'lol')
  fs.writeFileSync(path.join(second, 'file.bmp'), 'heehaw')

  var melvinStream = melvin(src, dirFilter)

  melvinStream.on('data', function() {
    ++count
  })

  melvinStream.on('end', function() {
    t.equal(count, 1)
    rimraf.sync(src)
  })

  function dirFilter(dir) {
    t.equal(dir, second)

    return false
  }
})

test('does recurse if configured', function(t) {
  t.plan(1)

  var src = path.join(tmp, 'src')
  var second = path.join(src, 'second')
  var count = 0

  mkdirp.sync(second)

  fs.writeFileSync(path.join(src, 'file.txt'), 'lol')
  fs.writeFileSync(path.join(second, 'file.bmp'), 'heehaw')

  var melvinStream = melvin(src, always(true))

  melvinStream.on('data', function() {
    ++count
  })

  melvinStream.on('end', function() {
    t.equal(count, 2)
    rimraf.sync(src)
  })
})

test('does not read files that do not pass filter', function(t) {
  t.plan(2)

  var src = path.join(tmp, 'src')
    , count = 0

  mkdirp.sync(src)

  fs.writeFileSync(path.join(src, 'file.txt'), 'lol')

  var melvinStream = melvin(src, null, fileFilter)

  melvinStream.on('data', function() {
    count++
  })

  melvinStream.on('end', function() {
    t.equal(count, 0)
  })

  function fileFilter(filename) {
    t.equal(filename, path.join(src, 'file.txt'))

    return false
  }
})

function always(val) {
  return function() {
    return val
  }
}
