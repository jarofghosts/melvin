var duplex = require('duplexify')

var writeFiles = require('./lib/write-files')
  , readFiles = require('./lib/read-files')

module.exports = melvin

function melvin(source, _dirFilter, _fileFilter) {
  var writable = writeFiles()
    , readable

  if(!source) {
    return writable
  }

  readable = readFiles(source, _dirFilter, _fileFilter)

  return duplex.obj(writable, readable)
}
