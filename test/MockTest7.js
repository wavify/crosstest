var fs = require('./OutputWriter');
var file = require('path').join(__dirname, 'Suite3.out');

var test = {
  
  'before each': function (test) {
    fs.appendFileSync(file, 'before each\n');
  },
  
  'test first': function (test) {
    fs.appendFileSync(file, 'test first\n');
  },
  
  'test second': function (test) {
    fs.appendFileSync(file, 'test second\n');
  }
  
}

exports.test = test;