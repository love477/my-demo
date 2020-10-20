const { DefaultDeserializer } = require("v8");

const nameLength = 15;

let buf1ssssdfsaf eUInt8(nameLength);

let buf2 = Buffer.alloc(1);
buf2.writeUInt8(nameLength);

const buf3 = Buffer.from('15');

console.log('buf1: ', buf1.toJSON(), buf1.readUInt8());
console.log('buf2: ', buf2.toJSON(), buf2.readUInt8());
console.log('buf3: ', buf3.toJSON(), buf3.readUInt8());











DefaultDeserializer

SVGDefsElement






SharedArrayBuffer


























sdfadfadsf