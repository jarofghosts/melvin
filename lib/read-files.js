var path = require('path')

var through = require('through2')
var fs = require('graceful-fs')

module.exports = readFile

function readFile (src, dirFilter, fileFilter) {
  var stream = through.obj({allowHalfOpen: true})

  var source = path.normalize(src)
  var total = 0

  start(source)

  return stream

  function start (dir) {
    fs.readdir(dir, processDir)

    function processDir (err, files) {
      if (err) {
        return stream.emit('error', err)
      }

      if (!files || !files.length) {
        return checkEnd()
      }

      total += files.length

      files.forEach(queueFile)

      function queueFile (file) {
        var fullFile = path.join(dir, file)

        fs.stat(fullFile, processFile)

        function processFile (fileErr, stats) {
          if (fileErr) {
            return stream.emit('error', fileErr)
          }

          if (stats.isDirectory()) {
            total--

            if (!dirFilter || dirFilter(fullFile)) {
              return start(fullFile)
            }

            return checkEnd()
          }

          if (fileFilter && !fileFilter(fullFile)) {
            total--

            return checkEnd()
          }

          fs.readFile(fullFile, emitContents)
        }

        function emitContents (contentErr, data) {
          if (contentErr) {
            return stream.emit('error', contentErr)
          }

          stream.push({filename: fullFile, data: data})
          total--

          checkEnd()
        }
      }
    }
  }

  function checkEnd () {
    if (!total) {
      stream.push(null)
    }
  }
}
