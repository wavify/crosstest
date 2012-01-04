var TestIt = require('test_it');

var TestRunner = require('../lib/runner/TestRunner').TestRunner;

TestIt ('TestTestRunner', {
  
  'test run': function (test) {
    var done = false;
    var object = {
      
    };
    
    var runner = new TestRunner('name', object);
    runner.run(function () {
      done = true;
    });
    
    test.waitFor(
      function (time) {
        return done || time > timeout;
      },
      function () {
        
      });
  }
  
});