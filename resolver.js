const mongoose = require('mongoose')
const CryptoJS = require('crypto-js')
const { UserModel } = require('./models/user.model')
const { AnimeModel } = require('./models/anime.model')

function rankingHighest(arr, n) {
  if (n == 1)
    return;
     
  for (var i = 0; i < n - 1; i++) {
    if (parseInt(arr[i].views) > parseInt(arr[i + 1].views)) {
      var temp = arr[i];
      arr[i] = arr[i + 1];
      arr[i + 1] = temp;
    }
  }

  rankingHighest(arr, n - 1);
}

function uploadedEarly(arr, n) {
  if (n == 1)
    return;
     
  for (var i = 0; i < n - 1; i++) {
    if (Date.parse(arr[i].episodes.sort((a, b) => b.uploadedAt - a.uploadedAt)[0].uploadedAt) > Date.parse(arr[i + 1].episodes.sort((a, b) => b.uploadedAt - a.uploadedAt)[0].uploadedAt)) {
      var temp = arr[i];
      arr[i] = arr[i + 1];
      arr[i + 1] = temp;
    }
  }

  uploadedEarly(arr, n - 1);
}

const resolvers = {
  Query: {
    user: async (parent, args, context, info) => {
      try {
        const doc = await UserModel().findOne({ 
          username: CryptoJS.AES.decrypt(args.username, args._csrf).toString(CryptoJS.enc.Utf8)
        }).lean()

        if(doc && 
          CryptoJS.AES.decrypt(args.password, args._csrf).toString(CryptoJS.enc.Utf8) ==
          CryptoJS.AES.decrypt(doc.password, doc.salt).toString(CryptoJS.enc.Utf8)
        ) {
          /* auth ok */
          return ({
            username: doc.username,
            clientId: doc.clientId,
            avatarUri: doc.avatarUri
          })
        } else {
          return ({
            username: null, clientId: null, avatarUri: null
          })
        }
      } catch(e) {
        console.error('Error')
      }
    },

    getAllAnimes: async (parent, args, context, info) => {
      var q = args.query || 'all'
      if(q == 'all') {
        const animes = await AnimeModel().find().lean()
        return {
          data: animes
        }
      } else {
        if(/(fantasy|romance|live_action|isekai|drama)/gm.test(q.toLowerCase())) {
          const animes = await AnimeModel().find().lean()
          const qAnimes = animes.filter(anime => {
            var animeGenresMapped = anime.genres.map(g => g.toLowerCase())
            return animeGenresMapped.indexOf(q.toLowerCase()) !== -1
          })
          return {
            data: [
              ...qAnimes
            ]
          }
        }
      }
    },

    listAnime: async (parent, args, context, info) => {
      if(args.type == 'top') {
        const animeTopList = await AnimeModel().find({}).lean()
        rankingHighest(animeTopList, animeTopList.length)
        const topSixRanking = animeTopList.slice(0,6);


        return {
          data: [...topSixRanking.sort((a, b) => parseInt(b.views) - parseInt(a.views))]
        }
      }

      if(args.type == 'newest') {
        const animeTopList = await AnimeModel().find({}).lean()
        uploadedEarly(animeTopList, animeTopList.length)
        const topSixUpdated = animeTopList.slice(0,6).reverse()
        return {
          data: [...topSixUpdated]
        }
      }
    },

    getAnime: async (parent, args, context, info) => {
      if(args.animeName && typeof args.animeName == 'string') {
        var animeDetail = await AnimeModel().findOne({
          name: args.animeName
        }).lean()
  
        if(animeDetail && animeDetail instanceof Object) {
          return ({
            name: animeDetail.name,
            vietnameseName: animeDetail.vietnameseName,
            imageUri: animeDetail.imageUri,
            star: animeDetail.star,
            views: animeDetail.views,
            totalEpisode: animeDetail.totalEpisode,
            animeModel: animeDetail.animeModel,
            genres: animeDetail.genres,
            description: animeDetail.description,
            episodes: animeDetail.episodes,
            comments: animeDetail.comments
          })
        }
      }
    },

    getUserByClientId: async (parent, args, context, info) => {
      const doc = await UserModel().findOne({ 
        clientId: args.clientId
      }).lean()

      if(doc) {
        return {
          data: args.clientId
        } 
      } else {
        return {
          data: 'Not Found'
        }
      }
    },

    getUserAnimeFollow: async (parent, args, context, info) => {
      if(!args.clientId) {
        return [{ name: '', imageUri: '', currentEpisode: null, totalEpisode: null }]
      } else {
        const user = await UserModel().findOne({ clientId: args.clientId }).lean()
        if(user) {
          const result = user.animeFavourites.map(async (anime) => {
            var eachItem = await AnimeModel().findOne({ name: anime }).lean()
            return ({ 
              name: eachItem.name, 
              vietnameseName: eachItem.vietnameseName, 
              imageUri: eachItem.imageUri 
            })
          })

          return {
            data: result
          }
        }
      }
    },

    getUserDetail: async (parent, args, context, info) => {
      if(!args.clientId) {
        return { 
          clientId: null
        }
      } else {
        const user = await UserModel().findOne({ clientId: args.clientId }).lean()
        if(user) {
          return {...user}
        } else {
          return { 
            clientId: null
          }
        }
      }
    }
  }
};

module.exports = resolvers