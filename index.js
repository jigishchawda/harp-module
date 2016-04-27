var awsIot = require('aws-iot-device-sdk');
var Gpio = require('chip-gpio').Gpio;

var button = new Gpio(6, 'in', 'both', {
  debounceTimeout: 500
});

var device = awsIot.device({
  keyPath: '/home/chip/.harp-chip/private.pem.key',
  certPath: '/home/chip/.harp-chip/certificate.pem.crt',
  caPath: '/home/chip/mozart/harp-module/root-CA.pem',
  clientId: 'harp-chip',
  region: 'ap-southeast-1',
  reconnectPeriod: 5000
});

device.subscribe('mozart');
device.on("message", function(topic, payload) {
  console.log("received message: ", topic, payload.toString());
});
button.watch(function(err, value) {
  if (err) {
    throw err;
  }
  console.log('Button pressed');

  device.publish('piano-chip/button', JSON.stringify({ event: 'click' }));
});

function exit() {
  button.unexport();
  process.exit();
}

process.on('SIGINT', exit);
