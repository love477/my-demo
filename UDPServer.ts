import * as net from 'net';

const HOST = '127.0.0.1';
const PORT = 8211;

net.createServer(function(sock) {
    console.log('CONNECTED: ' +
        sock.remoteAddress + ':' + sock.remotePort);

    sock.on('data', function(data) {
        console.log('data: ', data);
        console.log('DATA ' + sock.remoteAddress + ': ' + data);
        sock.write('You said "' + data + '"');
    });
    
    sock.on('close', function(data) {
        console.log('CLOSED: ' +
            sock.remoteAddress + ' ' + sock.remotePort);
    });

    sock.on('error', (err) => {
        console.error('socket error event: ', err);
    });
}).listen(PORT, HOST);

console.log('Server listening on ' + HOST +':'+ PORT);