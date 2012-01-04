var mime = require('mime'),
    path = require('path');

var SuiteRunner = require('./runner/SuiteRunner');
var TestRunner = require('./runner/TestRunner');

var CrossTest = function () {
  
}

CrossTest.prototype.test = function (file) {
  var callback = typeof arguments[arguments.length - 1] == 'function' ? 
                 arguments[arguments.length - 1] : function () {};
  var target = typeof arguments[1] == 'string' ? arguments[1] : null;

  if (path.existsSync(file)) {
    
    var type = mime.lookup(file);
    if (type == 'application/json') {
      
    } else if (type == 'application/javascript') {
      
    } else {
      console.error (file + ' is invalid file');
      callback();
    }
    
  } else {
    console.error (file + ' is not exists');
    callback();
  }
}

exports.CrossTest = CrossTest;