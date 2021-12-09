const sharp = require('sharp')
const express = require('express')
const router = express.Router()

router.get('/:hentai', async function(req, res) {
  const { hentai } = req.params
  const { type, width, height } = req.query
  var file = 'G:\\My Drive\\storage\\' + (type === 'avatar' ? 'avatars' : 'images') + '\\' + hentai
  const buffer = await sharp(file)
    .resize(parseInt(width), parseInt(height), {
      fit: 'fill'
    })
    .jpeg({ mozjpeg: true })
    .toBuffer()
  res.writeHead(200, {'content-type':'image/jpg'});
  res.write(buffer)
  res.end()
})

module.exports = router