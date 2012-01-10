var fs = require('./OutputWriter');
var file = require('path').join(__dirname, 'Suite3.out');

var test = {
  
  'test third': function (test) {
    fs.appendFileSync(file, 'test third\n');
  },
  
  'test forth': function (test) {
    fs.appendFileSync(file, 'test forth\n');
  }
  
}

exports.test = test;