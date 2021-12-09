const express = require('express')
const router = express.Router()

const { UserModel } = require('../models/user.model')

router.delete('/:clientId/delete', async function(req, res) {
  const { clientId } = req.params
  /* check if the same origin or not */
  if(req.headers['referer'].includes('http://localhost:3000/') && req.headers['origin'] == 'http://localhost:3000') {
    if(req.cookies['_id_'] && req.cookies['_salt_']) {
      try {
        const user = await UserModel().findOne({ clientId: clientId }).lean()
        if(user) {
          console.log("33333333")

          await UserModel().deleteOne({ clientId: clientId })

          res.clearCookie('_id_')
          res.clearCookie('_salt_')
          res.status(200).json({
            msg: 'Success'
          })
        }
      } catch(e) {
        res.end()
      }
    }
  }
  res.end()
})

router.post('/:userClientId/follow/:animeName', async function(req, res) {
  const { userClientId, animeName } = req.params

  const user = await UserModel().findOne({ clientId: userClientId }).lean()
  
  if(user) {
    if(user.animeFavourites.indexOf(animeName) !== -1) {
      res.redirect(301, 'http://localhost:3000/')
    } else {
      user.animeFavourites.push(animeName)

      try {
        await UserModel().findOneAndUpdate({ 
          clientId: userClientId,
        }, { animeFavourites: user.animeFavourites })
      } catch(e) {
        throw e;
      }

      res.status(200).json({
        statusCode: 200,
        statusMessage: 'Ok'
      })
    }
  } else {
    res.redirect(301, 'http://localhost:3000')
  }
})

router.delete('/:userClientId/delete/:animeName', async function(req, res) {
  const { userClientId, animeName } = req.params

  const user = await UserModel().findOne({ clientId: userClientId }).lean() 

  if(user) {
    if(user.animeFavourites.indexOf(animeName) !== -1) {
      var index = user.animeFavourites.indexOf(animeName)
      const newMapped = user.animeFavourites.map((anime,i) => index == i ? '' : anime).filter(item => item !== '')

      try {
        await UserModel().findOneAndUpdate({ 
          clientId: userClientId,
        }, { animeFavourites: newMapped })
      } catch(e) {
        throw e;
      }

      await res.status(200).json({
        statusCode: 200,
        statusMessage: 'Ok'
      })
    }
  } else {
    res.redirect(301, 'http://localhost:3000')
  }
})

module.exports = router