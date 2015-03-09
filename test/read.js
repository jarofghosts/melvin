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
          , write: true
        }
    )

    rimraf.sync(src)
  })
})

test('does not recurse if not configured', function(t) {
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
    t.equal(count, 1)
    rimraf.sync(src)
  })
})

test('does recurse if configured', function(t) {
  t.plan(1)

  var src = path.join(tmp, 'src')
  var second = path.join(src, 'second')
  var count = 0

  mkdirp.sync(second)

  fs.writeFileSync(path.join(src, 'file.txt'), 'lol')
  fs.writeFileSync(path.join(second, 'file.bmp'), 'heehaw')

  var melvinStream = melvin(src, {recurse: alwaysTrue})

  melvinStream.on('data', function() {
    ++count
  })

  melvinStream.on('end', function() {
    t.equal(count, 2)
    rimraf.sync(src)
  })
})

function alwaysTrue() {
  return true
}
