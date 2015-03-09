var path = require('path')

var through = require('through2')
  , fs = require('graceful-fs')
  , mkdirp = require('mkdirp')

module.exports = writeFiles

function writeFiles() {
  var available = []

  return through.obj(write)

  function write(data, x, done) {
    var self = this
      , pathname

    if(!data.write) {
      return done()
    }

    pathname = path.dirname(data.filename)

    if(available.indexOf(pathname) === -1) {
      available.push(pathname)

      return mkdirp(pathname, writeFile)
    }

    process.nextTick(writeFile)

    function writeFile(err) {
      if(err) {
        return done(err)
      }

      fs.writeFile(
          data.filename
        , data.data
        , {encoding: data.encoding}
        , finish
      )
    }

    function finish(err) {
      if(err) {
        return done(err)
      }

      self.emit('written', data.filename)
      done()
    }
  }
}
