const WebSocket = require('ws');

const ws_server = new WebSocket.Server({ port: 6000 }, () => {
    console.log('Socket Server Started!');
});

ws_server.on('connection', (ws_client) => {
    console.log('new connection');
    console.log(`${Array.from(ws_server.clients).length} active client(s)`);

    ws_client.on('message', (req) => {
        req = JSON.parse(req.toString());
        switch (req.type) {
            case 'OPEN_CONN_REQ':
                ws_client.userId = req.id;
                ws_client.send(JSON.stringify({ type: 'OPEN_CONN_RES', status: 'OK' }));
                break;
            case 'CLOSE_CONN_REQ':
                ws_client.send(JSON.stringify({ type: 'CLOSE_CONN_RES', status: 'OK' }));
                break;
            case 'SEND_MESSAGE_REQ':
                let res = {
                    ...req,
                    status: 'OK',
                    message: {
                        ...req.message,
                        recvd: true
                    }
                }
                ws_server.clients.forEach(client => {
                    if ((client.readyState === WebSocket.OPEN) && (client.userId === req.message.recipientId)) {
                        res.type = 'RECV_MESSAGE_REQ';
                        client.send(JSON.stringify(res));
                    }
                });
                res.type = 'SEND_MESSAGE_RES';
                ws_client.send(JSON.stringify(res));
                break;
            default:
                break;
        }
    });

    ws_client.on('close', () => {
        console.log('disconnected');
        console.log(`${Array.from(ws_server.clients).length} active client(s)`);
    });
});