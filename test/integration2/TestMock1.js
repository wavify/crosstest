var fs = require('../OutputWriter');
var file = require('path').join(__dirname, '..', 'Integration2.out');

var test = {
  'before all': function (test) {
    fs.appendFileSync(file, 'before all\n');
  },
  'after all': function (test) {
    fs.appendFileSync(file, 'after all\n');
  },
  'before each': function (test) {
    fs.appendFileSync(file, 'before each\n');
  },
  'after each': function (test) {
    fs.appendFileSync(file, 'after each\n');
  },
  'test first': function (test) {
    fs.appendFileSync(file, 'test first\n');
  },
  'test second': function (test) {
    fs.appendFileSync(file, 'test second\n');
  },
  'test third': function (test) {
    fs.appendFileSync(file, 'test third\n');
  }
}

exports.test = test;
