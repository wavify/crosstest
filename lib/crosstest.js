var fs = require('fs'),
    mime = require('mime'),
    path = require('path');

var GHUnitRunner = require('./runner/GHUnitRunner').GHUnitRunner;
var IntegrationRunner = require('./runner/IntegrationRunner').IntegrationRunner;
var SuiteRunner = require('./runner/SuiteRunner').SuiteRunner;
var TestRunner = require('./runner/TestRunner').TestRunner;

var CrossTest = function () {}

CrossTest.prototype.run = function (file) {
  var callback = typeof arguments[arguments.length - 1] == 'function' ? 
                 arguments[arguments.length - 1] : function () {};
  var target = typeof arguments[1] == 'string' ? arguments[1] : null;
  
  if (path.existsSync(file)) {
    
    var stat = fs.statSync(file);
    var type = mime.lookup(file);
    
    if (stat.isDirectory()) {
      var files = fs.readdirSync(file);
      var isXCodeProject = false;
      for (var index in files) {
        if (/\.xcodeproj$/i.test (files[index])) {
          isXCodeProject = true;
          break;
        }
      }
      
      if (isXCodeProject) {
        var runner = new GHUnitRunner(file, target);
        runner.run(callback);
      } else {
        // Run all file that have Test in prefix (Integration test)
        var runner = new IntegrationRunner('Test', file);
        runner.run(callback);
      }

    } else if (type == 'application/json') {
      // Parse it and send to suite runner
      var runner = new SuiteRunner(file);
      runner.run(callback);
    } else if (type == 'application/javascript') {
      // Sent to test runner
      var object = require(file).test;
      var name = path.basename(file, '.js');
      
      var runner = new TestRunner(name, object);
      runner.run(target, callback);
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