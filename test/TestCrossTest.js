var path = require('path');

var TestIt = require('test_it');

var MockConsole = require('./MockConsole').MockConsole;
var CrossTest = require('../lib/crosstest').CrossTest;

var timeout = 1000;

TestIt('TestCrossTest', {
  
  'before each': function (test) {
    var instance = new CrossTest();
    test.instance = instance;
  },
  
  'test run all unit': function (test) {
    var testPath = path.join(__dirname, 'MockTest.js');
    
    var done = false;
    
    var instance = test.instance;
    
    instance.test(testPath, function () {
      done = true;
    });
    
    test.waitFor(
      function(time) {
        return done || time > timeout;
      },
      function () {
        var expected = 'before all\n' +
                       'before each\n' +
                       'test first\n' +
                       'after each\n' +
                       'before each\n' +
                       'test second\n' +
                       'after each\n' +
                       'before each\n' +
                       'test third\n' +
                       'after each\n' +
                       'after all\n';
        test.assertEqual(expected, MockConsole.output, 
          'Output from test framework should run all tests');
      });
  },
  
  'test run specific unit': function (test) {
    var testPath = path.join(__dirname, 'MockTest.js');
    
    var done = false;
    
    var instance = test.instance;
    
    instance.test(testPath, 'test third', function () {
      done = true;
    });
    
    test.waitFor(
      function (time) {
        return done || time > timeout;
      },
      function () {
        var expected = 'before all\n' +
                       'before each\n' +
                       'test third\n' +
                       'after each\n' +
                       'after all\n';
        test.assertEqual(expected, MockConsole.output,
          'Output from test framework should have only test third');
      });
  },
  
  /*
  'test run unit suite': function (test) {
    var testPath = path.join(__dirname, 'MockTestSuite.json');
    
    var done = false;
    
    var instance = test.instance;
    
    instance.test(testPath, function () {
      done = true;
    });
    
    test.waitFor(
      function (time) {
        return done || time > timeout;
      },
      function () {
        var expected = 'before all\n' + 
                       'before each\n' +
                       'test first\n' +
                       'after each\n' +
                       'before each\n' +
                       'test third\n' +
                       'after each\n' +
                       'after all\n';
        test.assertEqual(expected, MockConsole.output,
          'Output from test framework should have first and third case');
      });
    
  }
  */
});