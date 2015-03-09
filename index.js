var duplex = require('duplexify')

var writeFiles = require('./lib/write-files')
  , readFiles = require('./lib/read-files')

module.exports = melvin

function melvin(source, _opts) {
  var opts = _opts || {}

  if(!source) {
    return writeFiles()
  }

  var readable = readFiles(source, opts)
  var writable = writeFiles()

  return duplex.obj(writable, readable)
}
