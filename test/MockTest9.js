var fs = require('./OutputWriter');
var file = require('path').join(__dirname, 'Suite4.out');

var test = {
  
  'test first': function (test) {
    fs.appendFileSync(file, 'test first\n');
  }
  
}

exports.test = test;