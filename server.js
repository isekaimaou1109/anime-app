const express = require('express')
const next = require('next')
const path = require('path')
const bodyParser = require('body-parser')
const { ApolloServer } = require('apollo-server-express')
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const typeDefs = require('./schema')
const resolvers = require('./resolver')

const { AnimeModel } = require('./models/anime.model')
const { UserModel } = require('./models/user.model')

const videoProcessRoute = require('./routes/video_process')
const imageProcessRoute = require('./routes/image_process')
const userRouteOperations = require('./routes/anime-follow')
const downloadRoute = require('./routes/download')
const searchRoute = require('./routes/search')
const logoutRoute = require('./routes/logout')

app.prepare().then(async () => {
  const server = express()
  mongoose.connect('mongodb://localhost:27017/admin', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true
  })
  server.use('/static', express.static(path.join(__dirname, 'assets')))
  server.use('/fonts', express.static(path.join(__dirname, 'assets', 'fonts')))
  server.use(bodyParser.json())
  server.use(bodyParser.urlencoded({ extended: true }))
  server.use(cookieParser())

  server.get('/get/pages', async function(req, res) {
    const animes = await AnimeModel().find().lean()
    res.status(200).json({ length: animes.length })
  })

  server.get('/comment/:animeName/', async function(req, res) {
    const { animeName } = req.params
    const anime = await AnimeModel().findOne({ name: animeName }).lean()
    if(anime) {
      res.status(200).json(anime.comments)
    } else {
      res.redirect(301, 'http://localhost:3000')
    }
  })

  

  server.post('/comment/:username/anime/:animeName', async function(req, res) {
    const { username, animeName } = req.params
    const { message } = req.body

    console.log('message is ' + message)
    console.log('anime name is ' + animeName)

    const anime = await AnimeModel().findOne({ name: animeName }).lean()

    if(anime) {
      const user = await UserModel().findOne({ username: username }).lean()

      if(user) {
        var isDuplicated = false
        for(let i = 0; i < anime.comments.length; i++) {
          if(anime.comments[i].message == message) {
            isDuplicated = true
            break;
          }
        }

        if(isDuplicated == false) {
          const newMapped = [...anime.comments, Object.assign({}, {
            username: user.username,
            message: message,
            createdAt: new Date().toLocaleString()
          })]

          console.log('map is ' + JSON.stringify(newMapped))
          await AnimeModel().findOneAndUpdate({ 
            name: animeName
          }, { comments: newMapped })
        }

        res.status(isDuplicated ? 404 : 200).json({ errorCode: isDuplicated ? 404 : 200 })
      } else {
        res.status(404).json({ errorCode: 404 })
      }
    } else {
      res.status(404).json({ errorCode: 404 })
    }
  })

  server.use('/search', searchRoute)
  server.use('/user', userRouteOperations)
  server.use('/video', videoProcessRoute)
  server.use('/image', imageProcessRoute)
  server.use('/download', downloadRoute)
  server.use('/logout', logoutRoute)

  const graphql_server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer: server })],
  });

  await graphql_server.start();
  graphql_server.applyMiddleware({ app: server });

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  await new Promise(resolve => server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  }));
  console.log(`🚀 Server ready at http://localhost:3000${graphql_server.graphqlPath}`);
})