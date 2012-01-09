var collector = require('./OutputCollector').getInstance('suite3');

var scripts = {
  before: {
    all: function (callback) {
      callback = callback || function () {};
      
      collector.append('scripts before all');
      callback();
    },
    each: function (callback) {
      callback = callback || function () {};
      
      collector.append('scripts before each');
      callback();
    }
  },
  after: {
    all: function (callback) {
      callback = callback || function () {};
      
      collector.append('scripts after all');
      callback();
    },
    each: function (callback) {
      callback = callback || function () {};
      
      collector.append('scripts after each');
      callback();
    }
  }
};

exports.scripts = scripts;