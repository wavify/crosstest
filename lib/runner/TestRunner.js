var TestIt = require('test_it');

var TestRunner = function (name, test) {
  this.name = name;
  this.test = test;
}

TestRunner.prototype.run = function () {
  var callback = typeof arguments[arguments.length - 1] == 'function' ?
                 arguments[arguments.length - 1] : function () {};
  var target = typeof arguments[0] == 'string' ? arguments[0] : null;
  
  var name = this.name;
  var test = this.test;
  
  var object = {};
  
  if (test['before all']) object['before all'] = test['before all'];
  if (test['before each']) object['before each'] = test['before each'];
  if (test['after each']) object['after each'] = test['after each'];
  if (test['after all']) {
    var original = test['after all'];
    object['after all'] = function (test) {
      original(test);
      
      callback();
    }
  } else {
    object['after all'] = callback;
  }
  
  if (target) {
    if (test[target]) object[target] = test[target];
  } else {
    for (var key in test) {
      if (key == 'before all' || key == 'before each' ||
          key == 'after all' || key == 'after each') {
        continue;
      }
      
      object[key] = test[key];
    }
  }
  
  TestIt(name, object);
}

exports.TestRunner = TestRunner;