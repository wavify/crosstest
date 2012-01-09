var async = require('async'),
    fs = require('fs'),
    path = require('path');
    
var TestRunner = require('./TestRunner').TestRunner;

var SuiteRunner = function (file) {
  this.suite = SuiteRunner.parse(file);
}

SuiteRunner.prototype.run = function (rootCallback) {
  var suite = this.suite;
  
  var iterator = function () {
    async.forEachSeries(suite.tests, 
      function (input, callback) {
        var runner = new TestRunner(input.name, input.test);
        
        var after = function () {
          if (suite.scripts &&
              suite.scripts.after &&
              suite.scripts.after.each) {
                
                suite.scripts.after.each(function () {
                  callback();
                });
                
          } else {
            callback();
          }
        }
        
        if (suite.scripts && 
            suite.scripts.before && 
            suite.scripts.before.each) {
          suite.scripts.before.each(function () {
            runner.run(function () {
              after();
            });
          });
        } else {
          runner.run(function () {
            after();
          });
        }
        
      }, 
      function (error) {
        if (suite.scripts &&
            suite.scripts.after &&
            suite.scripts.after.all) {
          suite.scripts.after.all(function () {
            rootCallback();
          });
        } else {
          rootCallback();
        }
        
      });
  }
  
  if (suite.scripts &&
      suite.scripts.before &&
      suite.scripts.before.all) {
    suite.scripts.before.all(function () {
      iterator();
    });
  } else {
    iterator();
  }
  
}

SuiteRunner.parse = function (file) {
  var output = {};
  
  if (path.existsSync(file)) {
    var object = JSON.parse(fs.readFileSync(file));
    output.name = object.name;
    output.tests = [];

    if (object.scripts) {
      var base = path.dirname(file);
      var scripts = require(path.join(base, object.scripts)).scripts;
      output.scripts = scripts;
    }
    
    for (var index in object.suite) {
      var test = object.suite[index];
      var testPath = path.join(path.dirname(file), test.file);
      if (path.existsSync(testPath)) {
        var testObject = require(testPath).test;
        if (testObject) {
          var testTarget = {};
          
          if (test.test.length > 0) {
            if (testObject['before all']) testTarget['before all'] = testObject['before all'];
            if (testObject['before each']) testTarget['before each'] = testObject['before each'];
            if (testObject['after each']) testTarget['after each'] = testObject['after each'];
            if (testObject['after all']) testTarget['after all'] = testObject['after all'];
            
            for (var key in test.test) {
              var name = test.test[key];
              if (testObject[name]) testTarget[name] = testObject[name];
            }
          } else {
            testTarget = testObject;
          }
          
          output.tests.push({
            name: test.name,
            test: testTarget
          });
        }
      } else {
        console.error (test.file + ' doesn\'t exists');
      }
    }
    
  } else {
    console.error (file + ' doesn\'t exists');
  }
  
  return output;
}

exports.SuiteRunner = SuiteRunner;