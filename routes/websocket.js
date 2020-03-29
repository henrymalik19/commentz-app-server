const Router = require('express').Router();

Router.ws('/', (ws_client, request) => {
    ws_client.on('message', (req) => {
        let clients = Array.from(request.ws_server.getWss().clients);
        req = JSON.parse(req.toString());
        switch (req.type) {
            case 'OPEN_CONN_REQ':
                ws_client.userId = req.id;
                ws_client.send(JSON.stringify({ type: 'OPEN_CONN_RES', status: 'OK' }));
                console.log('new connection');
                console.log(`${clients.length} active client(s)`);
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
                clients.forEach(client => {
                    if ((client.readyState === 1) && (client.userId === req.message.recipientId)) {
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
        console.log(`${clients.length} active client(s)`);
    });
})

module.exports = Router;