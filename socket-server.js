const WebSocket = require('ws');

const ws_server = new WebSocket.Server({ port: 6000 }, () => {
    console.log('Socket Server Started!');
});

ws_server.on('connection', (ws_client) => {
    console.log('new connection');
    console.log(`${Array.from(ws_server.clients).length} active client(s)`);

    ws_client.on('message', (data) => {
        console.log(`received: ${data}`);

        ws_client.send('Message received');
        ws_server.clients.forEach(client => {
            if ((client.readyState === WebSocket.OPEN) && (client !== ws_client)) {
                client.send(data);
            }
        });

    });

    ws_client.on('close', () => {
        console.log('disconnected');
        console.log(`${Array.from(ws_server.clients).length} active client(s)`);
    });
});