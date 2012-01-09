var collector = require('./OutputCollector').getInstance('suite4');

var test = {
  
  'test first': function (test) {
    collector.append('test first');
  },
  
  'test second': function (test) {
    collector.append('test second');
  }
  
}

exports.test = test;