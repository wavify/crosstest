var fs = require('fs'),
    path = require('path');
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
    
    var test2 = output.tests[1];
    test.assert(test2.name, 'Second test should have name');
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
                            'before each', 'test second', 'after each',
                            'before each', 'test third', 'after each',
                            'after all',
                            'before all',
                            'test first', 'after each',
                            'test second', 'after each'];
        
        var suiteOutputPath = path.join(__dirname, 'Suite1.out');
        test.assert(path.existsSync(suiteOutputPath), 
          'Output file should be exists');
        var output = fs.readFileSync(suiteOutputPath, 'utf8');
        fs.unlinkSync(suiteOutputPath);

        var actualOutput = output.split('\n');
                        
        for (var index in expectOutput) {
          test.assertEqual(expectOutput[index], actualOutput[index]);
        }
        
      });
    
  },
  
  'test run suite with scripts': function (test) {
    var done = false;
    
    var runner = new SuiteRunner(path.join(__dirname, 'MockTestSuite3.json'));
    runner.run(function () {
      done = true;
    });
    
    test.waitFor(
      function (time) {
        return done || time > timeout;
      },
      function () {
        var suiteOutputPath = path.join(__dirname, 'Suite3.out');
        test.assert(path.existsSync(suiteOutputPath), 
          'Output file should be exists');
        var output = fs.readFileSync(suiteOutputPath, 'utf8');
        fs.unlinkSync(suiteOutputPath);

        var actualOutput = output.split('\n');
        
        var expectOutput = [ 'scripts before all',
                             'scripts before each',
                             'before each', 'test first',
                             'before each', 'test second',
                             'scripts after each',
                             'scripts before each',
                             'test third',
                             'test forth',
                             'scripts after each',
                             'scripts after all'];
        
        for (var index in expectOutput) {
          test.assertEqual(expectOutput[index], actualOutput[index]);
        }
      });
  },
  
  'test run suite of suite': function (test) {
    var done = false;
    
    var runner = new SuiteRunner(path.join(__dirname, 'MockTestSuite4.json'));
    runner.run(function () {
      done = true;
    });
    
    test.waitFor(
      function (time) {
        return done || time > timeout;
      },
      function () {
        var suiteOutputPath = path.join(__dirname, 'Suite4.out');
        test.assert(path.existsSync(suiteOutputPath), 
          'Output file should be exists');
        var output = fs.readFileSync(suiteOutputPath, 'utf8');
        fs.unlinkSync(suiteOutputPath);

        var actualOutput = output.split('\n');
        var expectOutput = [ 'test first',
                             'test second' ];
        
        for (var index in expectOutput) {
          test.assertEqual(expectOutput[index], actualOutput[index]);
        }
      });
  }
  
});