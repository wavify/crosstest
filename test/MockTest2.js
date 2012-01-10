var fs = require('./OutputWriter');
var file = require('path').join(__dirname, 'Suite1.out');

var test = {
  'before all': function (test) {
    fs.appendFileSync(file, 'before all\n');
  },
  
  'test first': function (test) {
    fs.appendFileSync(file, 'test first\n');
  },
  
  'test second': function (test) {
    fs.appendFileSync(file, 'test second\n');
  },
  
  'after each': function (test) {
    fs.appendFileSync(file, 'after each\n');
  }
}

exports.test = test;