var path = require('path');
var TestIt = require('test_it');
var CrossTest = require('../lib/crosstest').CrossTest;

var timeout = 1000;

TestIt('TestCrossTest', {
  
  'before each': function (test) {
    var instance = new CrossTest();
    test.instance = instance;
  },
  
  'test run all unit': function (test) {
    var testPath = path.join(__dirname, 'MockTest3.js');
    
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
        var actual = require('./MockTest3').output;
        var expect = [ 'before all',
                       'before each', 'test first', 'after each',
                       'before each', 'test second', 'after each',
                       'before each', 'test third', 'after each',
                       'after all'];
        
        for (var index in expect) {
          test.assertEqual(expect[index], actual[index]);
        }
        
      });
  },
  
  'test run specific unit': function (test) {
    var testPath = path.join(__dirname, 'MockTest4.js');
    
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
        var actual = require('./MockTest4').output;
        var expect = [ 'before all',
                       'before each', 'test third', 'after each',
                       'after all'];
        
        for (var index in expect) {
          test.assertEqual(expect[index], actual[index]);
        }
        
      });
  },
  
  'test run unit suite': function (test) {
    var testPath = path.join(__dirname, 'MockTestSuite2.json');
    
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
        var mock1 = require('./MockTest5').output;
        var mock2 = require('./MockTest6').output;
        var actual = mock1.concat(mock2);
        var expect = [ 'before all',
                       'before each', 'test first', 'after each',
                       'before each', 'test thid', 'after each',
                       'after all'];
        
        for (var index in expect) {
          test.assertEqual(expect[index], actual[index]);
        }
        
      });
    
  }
});