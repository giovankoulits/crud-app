const logeEvents = require('./logEvents');

const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

myEmitter.on('test', (msg) => {
  logeEvents(msg);
});
myEmitter.emit('test', 'henlo fren');
