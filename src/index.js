import { server } from 'websocket'
import http from 'http'
import colour from './consoleColours'

const stdin = process.openStdin();

const httpServer = http.createServer((req, res) => {
  console.log((new Date) + ' Received request for ' + req.url)

  if (req.method != 'POST') {
    res.writeHead(404)
    res.end()
    return
  }


})

httpServer.listen(8081, () => {
  console.log(colour('bold') + (new Date()) + colour('reset') + ' Server is listening on port ' + colour('underlined') + '8081' + colour('reset'))
})

const wsServer = new server({
  httpServer: httpServer,
  autoAcceptConnections: true
})

function originIsAllowed(origin) {
  return true;
}

wsServer.on('connect', connection => {
  console.log(colour('bold') + (new Date()) + colour('reset') + colour('f_green') + ' Connection accepted.' + colour('reset'))

  const inputListener = d => {
    console.log(colour('bold') + (new Date()) + colour('reset') + ' Sending data to client.')
    connection.sendUTF(d.toString().trim());
  }

  stdin.addListener('data', inputListener)

  connection.on('message', message => {
    console.log(colour('bold') + (new Date()) + colour('reset') + ' Received: ' + colour('f_blue') + message.utf8Data + colour('reset'))
    connection.sendUTF(JSON.stringify({ status: 'success' }))
  })

  connection.on('close', (reasonCode, description) => {
    console.log(colour('bold') + (new Date()) + colour('reset') + colour('f_red') + ' Peer ' + connection.remoteAddress + ' disconnected.' + colour('reset'))
    stdin.removeListener('data', inputListener)
  })
})
