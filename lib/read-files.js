var path = require('path')

var Readable = require('readable-stream').Readable
  , fs = require('graceful-fs')

module.exports = readFile

function Readfile(src, dirFilter, fileFilter) {
  Readable.call(this, {objectMode: true})

  this.source = path.normalize(src)
  this.started = false
  this.dirFilter = dirFilter
  this.fileFilter = fileFilter
  this.total = 0
}

Readfile.prototype = Object.create(Readable.prototype)

Readfile.prototype._read = function() {
  if(!this.started) {
    this.started = true
    this.start(this.source)
  }
}

Readfile.prototype.start = function(dir) {
  var self = this

  fs.readdir(dir, processDir)

  function processDir(err, files) {
    if(err) {
      return self.emit('error', err)
    }

    if(!files || !files.length) {
      return checkEnd()
    }

    self.total += files.length

    files.forEach(queueFile)

    function queueFile(file) {
      var fullFile = path.join(dir, file)

      fs.stat(fullFile, processFile)

      function processFile(err, stats) {
        if(err) {
          return self.emit('error', err)
        }

        if(stats.isDirectory()) {
          self.total--

          if(!self.dirFilter || self.dirFilter(fullFile)) {
            return self.start(fullFile)
          }

          return checkEnd()
        }

        if(self.fileFilter && !self.fileFilter(fullFile)) {
          self.total--

          return checkEnd()
        }

        fs.readFile(fullFile, emitContents)
      }

      function emitContents(err, data) {
        if(err) {
          return self.emit('error', err)
        }

        self.push({filename: fullFile, data: data})
        self.total--

        checkEnd()
      }
    }

    function checkEnd() {
      if(!self.total && self.started) {
        self.push(null)
      }
    }
  }
}

function readFile(src, dirFilter, fileFilter) {
  return new Readfile(src, dirFilter, fileFilter)
}
