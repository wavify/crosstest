var path = require('path');

var TestIt = require('test_it');
var IntegrationRunner = require('../lib/runner/IntegrationRunner').IntegrationRunner;

var timeout = 1000;

TestIt('TestIntegrationRunner', {
  
  'test run': function (test) {
    var done = false;
    
    var runner = new IntegrationRunner('Mock', path.join(__dirname, 'integration'));
    runner.run(function () {
      done = true;
    });
    
    test.waitFor(
      function (time) {
        return done || time > timeout;
      },
      function () {
        var mock1 = require('./integration/MockTest1').output;
        var mock2 = require('./integration/MockTest2').output;
        
        var actual = mock1.concat(mock2);
        var expect = [ 'before all',
                       'before each', 'test first', 'after each',
                       'before each', 'test second', 'after each',
                       'before each', 'test third', 'after each',
                       'after all',
                       'before all',
                       'test first', 'after each',
                       'test second', 'after each'];
                       
        for (var index in expect) {
          test.assertEqual(expect[index], actual[index]);
        }
        
      });
  }
  
});