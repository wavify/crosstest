var collector = require('./OutputCollector').getInstance('suite3');

var test = {
  
  'test third': function (test) {
    collector.append('test third');
  },
  
  'test forth': function (test) {
    collector.append('test forth');
  }
  
}

exports.test = test;