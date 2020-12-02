/* eslint-disable no-shadow */
const net = require('net');
const {Buffer} = require('buffer');

/* eslint-disable max-len */
const request = function(address, buffer, tcpOptions = {}) {
    return new Promise((resolve, reject) => {
        if (!address || !address.ip || !address.port) {
            throw new Error('server address required.');
        }
        const client = new net.Socket();
        // 超时时间
        const timeout = tcpOptions.timeout;
        let responseData;
        // socket连接
        client.connect(address.port, address.ip, () => {
            // 日志:ip:port
            console.info(`address is : ${address.ip}:${address.port}`);
            // 监控:srpc连接量
            // Monitor.report(SRPC_COUNT);
            // 建立连接后立即向服务器发送数据，服务器将收到这些数据
            client.write(buffer);
            client.resume();
        });
        // data是服务器发回的数据
        client.on('data', function(data) {
            if (!responseData) {
                responseData = data;
            } else {
                responseData = Buffer.concat([responseData, data], responseData.length + data.length);
            }
            console.log('responseData: ', responseData.toString());
            if (responseData.length < 10) return;
            let headLength = responseData.readInt32BE(1);
            let bodyLength = responseData.readInt32BE(5);

            if (responseData.length === headLength + bodyLength + 10) {
                // 完全关闭连接
                client.destroy();
                headLength = responseData.readInt32BE(1);
                bodyLength = responseData.readInt32BE(5);
                const headBuf = responseData.slice(9, 9 + headLength);
                const bodyBuf = responseData.slice(9 + headLength, 9 + headLength + bodyLength);
                const d = {
                    head: headBuf,
                    body: bodyBuf,
                };
                // 监控:srpc成功量
                // Monitor.report(SRPC_SUCCESS_COUNT);
                resolve(d);
            }
        });
        // 异常处理
        client.on('error', function(err) {
            // 日志:请求失败错误信息
            console.info(err && err.message || 'srpc连接出现未知错误');
            // 监控:srpc失败量
            // Monitor.report(SRPC_FAILED_COUNT);
            reject(err);
        });
        // 为客户端添加“close”事件处理函数
        client.on('close', function() {
            // 监控:srpc失败量
            console.info('close');
            // Monitor.report(SRPC_CLOSE_COUNT);
        });

        // 如果设置了超时
        if (timeout) {
            client.setTimeout(timeout);
            client.on('timeout', () => {
                const err = Error(`srpc连接超时,timeout:${timeout}`);
                err.code = 504;
                // 日志:请求失败错误信息
                console.info(err.message);
                // 监控:srpc失败量
                // Monitor.report(SRPC_FAILED_COUNT);
                client.end();
                reject(err);
            });
        }
    });
};


const testAddress = {
    ip: '127.0.0.1',
    // port: 8211,
};
const testBuf = Buffer.from('hello');

(async () => {
    const res = await request(testAddress, testBuf).catch((err) => {
        console.error('request err: ', err);
        throw new Error(err);
    });
    console.log('res: ', res);
})();
