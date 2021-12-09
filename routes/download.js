const fs = require('fs')
const rateLimit = require("express-rate-limit");
const express = require('express')
const router = express.Router()

const downloadLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, 
  max: 3 
});

router.get('/:filename', downloadLimiter, function(req, res) {
  const { filename } = req.params
  console.log('filename is ' + filename)
  res.attachment(filename)
  const buf = fs.readFileSync('G:\\My Drive\\storage\\animes\\' + filename.split('.mp4').join('').replace(/\b-ep-\d+\b/gm, '') + '\\' + filename )
  res.write(buf)
  res.end()
})

module.exports = router