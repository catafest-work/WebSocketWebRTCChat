const Socket = require('websocket').server

const http = require('http')
const { connection } = require('websocket')

const server = http.createServer((req, res) => {})

server.listen(3000, () => {
  console.log('listening on port 3000 !')
})

// connect this http server with websocket
const websocket = new Socket({httpServer:server})

// create users array 

let users = []

websocket.on('request', (req) => {
  console.log('A new client is connected')
  const conection = req.accept();
  connection.on('message', (message) =>  {
    const data = JSON.parse(message.utf8Data)
    const user = findUser(data.username)
    switch(data.type)
      {
      // storing the user 
      case "store_user":
        // database connection
        if(user != null) {
          return 
        }
        const newUser = {
          conn: connection,
          username:data.username
        }
        // user array 
        users.push(newUser)
        console.log(newUser.username)
        break;
      // store offered users
      case "store_offer": 
        if (user == null) { return }
        user.offer = data.offer
        break;
      //
      case "store_candidate":
        if(user == null) {
          return
        }
        if(user.condidates == null)
        {
          user.candidates = []
        }
        user.candidates.push(data.candidate)
        break;
      case "send_answer":
        if(user == null) {
          return;
        }
        sendData({
          type:'answer',
          answer: data.answer
        }, user.conn)
        break;
      case 'send_candidate':
        if(user == null) {
          return;
        }
        sendData({
          type:'candidate',
          candidate: data.candidate
        }, user.conn)
        break
      case 'join_call':
        id(user == null) {
          return
        }
        sendDaat({
          type:'offer',
          offfer:user.offer
        }, connection)
        
    }
  })
})