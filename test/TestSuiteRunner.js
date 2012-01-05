var path = require('path');
var TestIt = require('test_it');

var SuiteRunner = require('../lib/runner/SuiteRunner').SuiteRunner;

var timeout = 1000;

TestIt('TestSuiteRunner', {
  
  'test parse': function (test) {
    var output = SuiteRunner.parse(path.join(__dirname, 'MockTestSuite.json'));
    
    test.assert(output.name, 'Suite object should have name');
    test.assert(output.tests, 'Suite object should have tests');
    test.assertEqual(2, output.tests.length, 'Output should have 2 instance in it');
    
    var test1 = output.tests[0];
    test.assert(test1.name, 'First test should have name');
    test.assert(test1.test, 'First test should have test');
    test.assert(test1.test['before all'], 'First test should have before all');
    test.assert(test1.test['before each'], 'First test should have before each');
    test.assert(test1.test['after each'], 'First test should have after each');
    test.assert(test1.test['after all'], 'First test should have after all');
    test.assert(test1.test['test first'], 'First test should have "test first"');
    test.assert(!test1.test['test second'], 'First test should not have "test first"');
    test.assert(test1.test['test third'], 'First test should have "test third"');
    
    var test2 = output.tests[1];
    test.assert(test2.name, 'Second test should have name');
    test.assert(test2.test, 'Second test should have test');
    test.assert(test2.test['before all'], 'Second test should have before all');
    test.assert(!test2.test['before each'], 'Second test should not have before each');
    test.assert(test2.test['after each'], 'Second test should have after each');
    test.assert(!test2.test['after all'], 'Second test should not have after all');
    test.assert(test2.test['test first'], 'Second test should have "test first"');
    test.assert(!test2.test['test second'], 'Second test should not have "test first"');
  },
  
  'test run': function (test) {
    
    var done = false;
    
    var runner = new SuiteRunner(path.join(__dirname, 'MockTestSuite.json'));
    runner.run(function () {
      done = true;
    });
    
    test.waitFor(
      function (time) {
        return done || time > timeout;
      },
      function () {
        var expectOutput = ['before all', 
                            'before each', 'test first', 'after each',
                            'before each', 'test third', 'after each',
                            'after all',
                            'before all',
                            'test first', 'after each'];
                            
        var mock1 = require('./MockTest').output;
        var mock2 = require('./MockTest2').output;
        var actualOutput = mock1.concat(mock2);
        
        for (var index in expectOutput) {
          test.assertEqual(expectOutput[index], actualOutput[index]);
        }
        
      });
    
  }
  
});