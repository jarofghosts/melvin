var duplex = require('duplexify')

var writeFiles = require('./lib/write-files')
  , readFiles = require('./lib/read-files')

module.exports = melvin

function melvin(source, _dirFilter) {
  if(!source) {
    return writeFiles()
  }

  var readable = readFiles(source, _dirFilter)
  var writable = writeFiles()

  return duplex.obj(writable, readable)
}
