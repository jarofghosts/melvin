var path = require('path')
var os = require('os')
var fs = require('fs')

var mkdirp = require('mkdirp')
var rimraf = require('rimraf')
var test = require('tape')

var melvin = require('../')

var tmp = os.tmpdir()

test('writes files to disk', function (t) {
  t.plan(2)

  var src = path.join(tmp, 'src')

  mkdirp.sync(src)

  var melvinStream = melvin()

  melvinStream.on('written', function (filename) {
    t.equal(filename, path.join(src, 'file.txt'))
    t.deepEqual(fs.readFileSync(filename), new Buffer('lol'))

    rimraf.sync(src)
  })

  melvinStream.write({
    filename: path.join(src, 'file.txt'),
    data: new Buffer('lol')
  })
})
