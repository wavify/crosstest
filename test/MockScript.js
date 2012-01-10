var fs = require('./OutputWriter');
var file = require('path').join(__dirname, 'Suite3.out');

var scripts = {
  before: {
    all: function (callback) {
      callback = callback || function () {};
      
      fs.appendFileSync(file, 'scripts before all\n');
      callback();
    },
    each: function (callback) {
      callback = callback || function () {};
      
      fs.appendFileSync(file, 'scripts before each\n');
      callback();
    }
  },
  after: {
    all: function (callback) {
      callback = callback || function () {};
      
      fs.appendFileSync(file, 'scripts after all\n');
      callback();
    },
    each: function (callback) {
      callback = callback || function () {};
      
      fs.appendFileSync(file, 'scripts after each\n');
      callback();
    }
  }
};

exports.scripts = scripts;