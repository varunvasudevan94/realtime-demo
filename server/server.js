import bodyParser from 'body-parser'
import express from 'express'
import path from 'path'
import Socket from 'socket.io';

const app = express()
const server = require('http').Server(app);
const io = require('socket.io')(server, { origins: '*:*'});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

const router = express.Router()

const staticFiles = express.static(path.join(__dirname, '../../client/build'))
app.use(staticFiles)


// Use io-socket over here

app.use(router)

// any routes not picked up by the server api will be handled by the react router
app.use('/*', staticFiles)

app.set('port', (process.env.PORT || 3001))


server.listen(app.get('port'), () => {
  console.log(`Listening on ${app.get('port')}`)
})

io.origins('*:*')

var dataList = [];

io.on('connection', (socket) => {
  
  socket.emit('addItem', dataList);
  console.log("hello");
  socket.on('addItem', (data) => {
      dataList.push(data);
      console.log(dataList);
      if (data === null) {
        console.log('clearing');
        dataList=[];
        socket.broadcast.emit('addItem', null);
      }
      else {
        socket.broadcast.emit('addItem', [data]);
      }
      
  });
});
