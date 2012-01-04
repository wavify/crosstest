var TestIt = require('test_it');

var TestRunner = require('../lib/runner/TestRunner').TestRunner;

var timeout = 1000;

TestIt ('TestTestRunner', {
  
  'before each': function (test) {
    var output = [];
    var object = {
      'before each': function (test) {
        output.push('before each');
      },
      'test first': function (test) {
        output.push('test first');
      },
      'test second': function (test) {
        output.push('test second');
      },
      'test third': function (test) {
        output.push('test third');
      }
    };
    
    var runner = new TestRunner('TestName', object);
    test.instance = runner;
    test.output = output;
  },
  
  'test run': function (test) {
    var done = false;
    var runner = test.instance;
    runner.run(function () {
      done = true;
    });

    test.waitFor(
      function (time) {
        return done || time > timeout;
      },
      function () {
        var output = test.output;
        test.assertEqual(6, output.length, 'Output should have 6 lines');
        var expected = [ 'before each', 'test first',
                         'before each', 'test second',
                         'before each', 'test third'];
        for (var index in expected) {
          test.assertEqual(expected[index], output[index],
            'Some output doesn\'t match expect output');
        }
      });

  },

  'test run specific': function (test) {
    var done = false;
    var runner = test.instance;
    runner.run('test first', function () {
      done = true;
    });
    
    test.waitFor(
      function (time) {
        return done || time > timeout;
      },
      function () {
        var output = test.output;
        test.assertEqual(2, output.length, 'Output should have 2 lines');
        
        var expected = [ 'before each', 'test first' ];
        for (var index in expected) {
          test.assertEqual(expected[index], output[index],
            'Some output doesn\'t match expect output');
        }
      });
  }
  
});