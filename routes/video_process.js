const fs = require('fs')
const express = require('express')
const router = express.Router()

router.get('/:videoName', function(req, res) {
  const { videoName } = req.params
  var file = 'G:\\My Drive\\storage\\animes\\' + videoName.split('.mp4').join('').replace(/\b-ep-\d+\b/gm, '') + '\\' + videoName
  fs.stat(file, function(err, stats) {
    if (err) {
      if (err.code === 'ENOENT') {
        return res.sendStatus(404);
      }
      res.end(err);
    }
    var range = req.headers.range;
    if (!range) {
    // 416 Wrong range
    return res.sendStatus(416);
    }
    var positions = range.replace(/bytes=/, "").split("-");
    var start = parseInt(positions[0], 10);
    var total = stats.size;
    var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
    var chunksize = (end - start) + 1;

    res.writeHead(206, {
      "Content-Range": "bytes " + start + "-" + end + "/" + total,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4"
    });

    var stream = fs.createReadStream(file, { start: start, end: end })
      .on("open", function() {
        stream.pipe(res);
      }).on("error", function(err) {
        res.end(err);
      });
  });
})

module.exports = router