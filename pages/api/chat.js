import { AnimeModel } from '../../models/a.model'

export default async function chat(req, res) {
  if (req.method === "POST") {
    // get message
    const { message, username, animeName } = req.body;
    // console.log('request body is ' + JSON.stringify(req.body))
    // // dispatch to channel "message"
    if(res.socket.server.io) {
      const animeCmts = await AnimeModel().find({ name: animeName }).lean()
      
      // const newCmts = [{ 
      //   username: username, 
      //   createdAt: new Date().toLocaleString(),  
      //   message: message
      // }, ...animeCmts.comments]
      // AnimeModel().findOneAndUpdate({ name: animeName }, {
      //   comments: newCmts
      // })
      res.socket.server.io.emit("message", message);
      // return message
      res.status(200).json({
        msg: animeCmts
      });
    }
  }
};