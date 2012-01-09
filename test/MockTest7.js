var collector = require('./OutputCollector').getInstance('suite3');

var test = {
  
  'before each': function (test) {
    collector.append('before each');
  },
  
  'test first': function (test) {
    collector.append('test first');
  },
  
  'test second': function (test) {
    collector.append('test second');
  }
  
}

exports.test = test;