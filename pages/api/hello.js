import axios from 'axios'
import Cookies from 'cookies'
import CryptoJS from 'crypto-js'
import randToken from 'rand-token'
import nc from "next-connect";

const handler = nc({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res, next) => {
    res.status(404).end("Page is not found");
  },
}).post(async (req, res) => {
  console.log('req body is ' + JSON.stringify(req.body))
  const { username, password, _csrf } = req.body

  const data = {
    query: `
      query Query($username: String, $password: String, $_csrf: String) {
        user(username: $username, password: $password, _csrf: $_csrf) {
          username
          clientId
          avatarUri
        }
      }
    `,
    variables: {
      username,
      password,
      _csrf
    }
  }

  const options = {
    method: 'POST',
    data,
    url: 'http://localhost:3000/graphql',
    withCredential: true
  };

  const response = await axios(options)

  if(response.status == 200 && response.data) {
    /* clear _csrf cookie */
    res.setHeader(
      "Set-Cookie", [
      `_csrf=deleted; Max-Age=0`,
      `AnotherCookieName=deleted; Max-Age=0`]
    );
    
    const salt = randToken.generate(24)
    const cookies = new Cookies(req, res)
    cookies.set('_id_', CryptoJS.AES.encrypt(response.data.data.user.clientId, salt).toString())
    cookies.set('_salt_', salt)
    res.json(response.data.data.user)
  } 
})

export default handler;

// export default async function handler(req, res) {
//   if(req.method === 'POST') {
//     const { username, password, _csrf } = req.body
//     const data = {
//       query: `
//         query Query($username: String, $password: String, $_csrf: String) {
//           user(username: $username, password: $password, _csrf: $_csrf) {
//             username
//             clientId
//             avatarUri
//           }
//         }
//       `,
//       variables: {
//         username,
//         password,
//         _csrf
//       }
//     }
//     const options = {
//       method: 'POST',
//       data,
//       url: 'http://localhost:3000/graphql',
//       withCredential: true
//     };

//     await axios(options).then(response => {
//       console.log('response ' + JSON.stringify(response))
//       if(response.status == 200 && response.data) {
//         /* clear _csrf cookie */
//         res.setHeader(
//           "Set-Cookie", [
//           `_csrf=deleted; Max-Age=0`,
//           `AnotherCookieName=deleted; Max-Age=0`]
//         );
        
//         const salt = randToken.generate(24)
//         const cookies = new Cookies(req, res)
//         cookies.set('_id_', CryptoJS.AES.encrypt(response.data.data.user.clientId, salt).toString())
//         cookies.set('_salt_', salt)
//         res.json(response.data.data.user)
//       }
//     }).catch(err => console.log)

//   }
// }
