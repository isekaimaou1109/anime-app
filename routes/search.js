const express = require('express')
const router = express.Router()

const { AnimeModel } = require('../models/anime.model')

router.get('/', async function(req, res) {
  const { q } = req.query
  const docs = await AnimeModel().find().lean()
  const map = docs.filter(item => item.name.replace(/\-+/gm, ' ').includes(q.toLocaleLowerCase())).map(o => ({
    name: o["name"].split('-').filter(item => item !== '').map(item => item[0].toUpperCase() + item.slice(1, item.length + 1)).join(' '),
    vietnameseName: o["vietnameseName"],
    imageUri: o["imageUri"]
  }))
  res.status(200).json(q.length !== 0 ? (map.length > 6 ? map.slice(0,5) : map) : [])
})

module.exports = router