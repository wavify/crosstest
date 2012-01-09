var collector = require('./OutputCollector').getInstance('suite4');

var scripts = {
  before: {
    each: function (callback) {
      callback = callback || function () {};
      
      collector.append('scripts before each');
      callback();
    }
  },
  after: {
    each: function (callback) {
      callback = callback || function () {};
      
      collector.append('scripts after each');
      callback();
    }
  }
};

exports.scripts = scripts;