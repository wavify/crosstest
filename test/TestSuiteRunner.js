var path = require('path');

var TestIt = require('test_it');

var MockConsole = require('./MockConsole').MockConsole;
var SuiteRunner = require('../lib/runner/SuiteRunner').SuiteRunner;

var timeout = 1000;

TestIt('TestSuiteRunner', {
  
  'test parse': function (test) {
    var output = SuiteRunner.parse(path.join(__dirname, 'MockTestSuite.json'));
    
    test.assert(output.constructor == Array, 'Output from Suite.parse should be Array');
    test.assertEqual(2, output.length, 'Output should have 2 instance in it');
    
    var test1 = output[0];
    test.assert(test1['before all'], 'First test should have before all');
    test.assert(test1['before each'], 'First test should have before each');
    test.assert(test1['after each'], 'First test should have after each');
    test.assert(test1['after all'], 'First test should have after all');
    test.assert(test1['test first'], 'First test should have "test first"');
    test.assert(!test1['test second'], 'First test should not have "test first"');
    test.assert(test1['test third'], 'First test should have "test third"');
    
    var test2 = output[1];
    test.assert(test2['befoer all'], 'Second test should have before all');
    test.assert(!test2['before each'], 'Second test should not have before each');
    test.assert(test2['after each'], 'Second test should have after each');
    test.assert(!test2['after all'], 'Second test should not have after all');
    test.assert(test2['test first'], 'Second test should have "test first"');
    test.assert(!test2['test second'], 'Second test should not have "test first"');
  },
  
  'test run': function (test) {
    MockConsole.setup(console);
    
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
        var actualOutput = MockConsole.output;
        var expectOutput = 'before all\n' +
                           'before each\n' +
                           'test first\n' +
                           'after each\n' +
                           'before each\n' +
                           'test third\n' +
                           'after each\n' +
                           'after all\n' +
                           'before all\n' +
                           'test first\n' +
                           'after each\n';
        test.assertEqual(expectOutput, actualOutput,
          'Actual output should be the same as Expect output');
                           
        MockConsole.reset();
      });
    
  }
  
});