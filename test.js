// const { DownloaderHelper } = require('node-downloader-helper');
// const dl = new DownloaderHelper('http://localhost:3000/video/86-ep-13.mp4', __dirname);

// dl.on('end', () => console.log('Download Completed'))
// dl.start();

// const got = require("got");
// const { createWriteStream } = require('fs')

// got.stream('http://localhost:3000/video/86-ep-13.mp4', { isStream: true })
//    .pipe(createWriteStream('86-ep-13.mp4'));;

const c = require('crypto-js')

console.log(c.AES.decrypt('U2FsdGVkX1+LDu+2wxQwh+/Wu50WExbGtLmaTSmBQVU=', 'aIWh4DrPWyFHWoSVxxP87i8oVze6rhcL9D762inkrCXX7VFZyEDJ0Ieb').toString(c.enc.Utf8))

// const axios = require('axios')

// var q = `
//     query Query($query: String) {
//       getAllAnimes(query: $query) {
//         data {
//           name
//           vietnameseName
//           genres
//           imageUri
//           views
//           currentEpisode
//           totalEpisode
//         }
//       }
//     }
//   `
//   var variables = { query: 'all' }
  
//   const data = {
//     query: q,
//     variables
//   }

//   const options = {
//     method: 'POST',
//     data: data,
//     url: 'http://localhost:3000/graphql',
//   };

//   axios(options).then(res => console.log(res.data.data.getAllAnimes.data))


// const { Readable } = require('stream'); 
// const mongoose = require('mongoose')
// mongoose.connect('mongodb://localhost:27017/admin', { 
//    useNewUrlParser: true, 
//    useUnifiedTopology: true
// })
// const { AnimeModel } = require('./models/anime.model')

// console.time('s')
// AnimeModel().
//   find({ name: new RegExp('^t', 'gm') }).
//   cursor().
//   on('data', function(doc) { 
//     const inStream = new Readable({
//       read() {}
//     });

//     inStream.push(JSON.stringify(doc));
//     inStream.push(null); 

//     inStream.pipe(res);
//   }).
//   on('end', function() { console.log('Done!'); });

// const JSON5 = require('json5')

// import CryptoJS from 'crypto-js'
// import axios from 'axios'

// export default function middleware(req, event) {
//   if(req.cookies._id_ && req.cookies._salt_) {
//     let clientId = CryptoJS.AES.decrypt(req.cookies._id_, req.cookies._salt_).toString(CryptoJS.enc.Utf8)
//     console.log(clientId)
//     const data = {
//       query: `
//         query Query($clientId: String) {
//           getUserByClientId(clientId: $clientId) {
//             data
//           }
//         }
//       `,
//       variables: {
//         clientId
//       }
//     }
//     const options = {
//       method: 'POST',
//       data,
//       url: 'http://localhost:3000/graphql',
//       withCredential: true
//     };

//     axios(options).then(response => {
//       if(clientId == response.data.data.getUserByClientId.data) {
//         console.log('day ne ')
//         return ;
//       }
//     }).catch(() => console.log('cannot fetch user by client id'))

//     return undefined
//   }
// }