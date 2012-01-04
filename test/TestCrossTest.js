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
    
    instance.unit(testPath, function (output) {
      done = true;
    });
    
    test.waitFor(
      function(time) {
        return done || time > timeout;
      },
      function () {
        
      });
  },
  'test run specific unit': function (test) {
    var testPath = path.join(__dirname, 'MockTest.js');
    
    var done = false;
    
    var instance = test.instance;
    
    instance.unit(testPath, 'test third', function (output) {
      done = true;
    });
    
    test.waitFor(
      function (time) {
        return done || time > timeout;
      },
      function () {
        
      });
  },
  'test run unit suite': function (test) {
    var testPath = path.join(__dirname, 'MockUnitSuite.json');
    
    var done = false;
    
    var instance = test.instance;
    
    instance.unit(testPath, function (output) {
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