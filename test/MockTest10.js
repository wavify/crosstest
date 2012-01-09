var collector = require('./OutputCollector').getInstance('suite4');

var test = {
  
  'test third': function (test) {
    collector.append('test third');
  },
  
  'test forth': function (test) {
    collector.append('test forth');
  },
  
  'test fifth': function (test) {
    collector.append('test fifth');
  }
  
}

exports.test = test;