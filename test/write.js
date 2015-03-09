var path = require('path')
  , os = require('os')
  , fs = require('fs')

var mkdirp = require('mkdirp')
  , rimraf = require('rimraf')
  , test = require('tape')

var melvin = require('../')

var tmp = os.tmpdir()

test('writes files to disk', function(t) {
  t.plan(2)

  var src = path.join(tmp, 'src')

  mkdirp.sync(src)

  var melvinStream = melvin()

  melvinStream.on('written', function(filename) {
    t.equal(filename, path.join(src, 'file.txt'))
    t.deepEqual(fs.readFileSync(filename), new Buffer('lol'))

    rimraf.sync(src)
  })

  melvinStream.write({
      filename: path.join(src, 'file.txt')
    , data: new Buffer('lol')
  })
})
