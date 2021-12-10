import { Server } from 'socket.io'

export const config = {
  api: {
    bodyParser: false
  }
}

export default async (req, res) => {
  if (!res.socket.server.io) {
    console.log("New Socket.io server...");
    // adapt Next's net Server to http Server
    const httpServer = res.socket.server;
    const io = new Server(httpServer, {
      path: "/api/io",
    });
    // append SocketIO server to Next.js socket server response
    res.socket.server.io = io;
  }
  res.end();
};


// const ioHandler = (req, res) => {
//   if (!res.socket.server.io) {
//     console.log('*First use, starting socket.io')

//     const io = new Server(res.socket.server)

//     io.on('connection', socket => {
//       socket.broadcast.emit('a user connected')
      
//       socket.on('hello', msg => {
//         socket.emit('hello', 'world!')
//       })

//       socket.on('comment', function(object) {

//       })
//     })

//     res.socket.server.io = io
//   } else {
//     console.log('socket.io already running')
//   }
//   res.end()
// }

// export default ioHandler