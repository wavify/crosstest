var fs = require('./OutputWriter');
var file = require('path').join(__dirname, 'Suite4.out');

var test = {
  
  'test second': function (test) {
    fs.appendFileSync(file, 'test second\n');
  }
  
}

exports.test = test;