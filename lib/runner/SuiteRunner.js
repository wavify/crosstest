var async = require('async'),
    fs = require('fs'),
    path = require('path');
    
var TestRunner = require('./TestRunner').TestRunner;

var SuiteRunner = function (file) {
  this.suite = SuiteRunner.parse(file);
}

SuiteRunner.prototype.run = function (callback) {
  var suite = this.suite;
  
  async.forEach(suite.tests, 
    function (input, callback) {
      var runner = new TestRunner(input.name, input.test);
      runner.run(function () {
        callback();
      });
    }, 
    function (error) {
      console.info ('done');
    });
}

SuiteRunner.parse = function (file) {
  var output = {};
  
  if (path.existsSync(file)) {
    var object = JSON.parse(fs.readFileSync(file));
    output.name = object.name;
    output.tests = [];
    
    for (var index in object.suite) {
      var test = object.suite[index];
      var testPath = path.join(path.dirname(file), test.file);
      if (path.existsSync(testPath)) {
        var testObject = require(testPath).test;
        if (testObject) {
          var testTarget = {};
          if (testObject['before all']) testTarget['before all'] = testObject['before all'];
          if (testObject['before each']) testTarget['before each'] = testObject['before each'];
          if (testObject['after each']) testTarget['after each'] = testObject['after each'];
          if (testObject['after all']) testTarget['after all'] = testObject['after all'];
          
          for (var key in test.test) {
            var name = test.test[key];
            if (testObject[name]) testTarget[name] = testObject[name];
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