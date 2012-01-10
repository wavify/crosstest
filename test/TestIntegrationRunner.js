var fs = require('fs'),
    path = require('path');

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
        var integrationOutputPath = path.join(__dirname, 'Integration.out');
        
        test.assert(path.existsSync(integrationOutputPath), 
          'Output file should be exists');
        var output = fs.readFileSync(integrationOutputPath, 'utf8');
        fs.unlinkSync(integrationOutputPath);
        
        var actual = output.split('\n');
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