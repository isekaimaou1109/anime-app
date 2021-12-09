const express = require('express')
const router = express.Router()

router.get('/', function(req, res) {
  try {
    if(req.cookies['_salt_'] && req.cookies['_id_']) {
      if(req.cookies['_csrf']) {
        res.clearCookie('_csrf')
      }
      res.clearCookie('_id_')
      res.clearCookie('_salt_')
    }
  } catch(e) {
    res.status(404).json({
      errorMessage: "Bạn chưa login mà đòi logout thì chỉ có cái nịt",
      errorCode: 404
    })
  }

  res.redirect(301, 'http://localhost:3000')
})

module.exports = router