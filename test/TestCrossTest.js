var fs = require('fs'),
    path = require('path');
    
var TestIt = require('test_it');
var CrossTest = require('../lib/CrossTest').CrossTest;

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
    
    instance.run(testPath, function () {
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
    
    instance.run(testPath, 'test third', function () {
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
    
    instance.run(testPath, function () {
      done = true;
    });
    
    test.waitFor(
      function (time) {
        return done || time > timeout;
      },
      function () {
        var suiteOutputPath = path.join(__dirname, 'Suite2.out');
        test.assert(path.existsSync(suiteOutputPath), 
          'Output file should be exists');
        var output = fs.readFileSync(suiteOutputPath, 'utf8');
        fs.unlinkSync(suiteOutputPath);
        
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
    
  },
  
  'test run folder': function (test) {
    var testPath = path.join(__dirname, 'integration2');
    
    var done = false;
    
    var instance = test.instance;
    instance.run(testPath, function () {
      done = true;
    });
    
    test.waitFor(
      function (time) {
        return done || time > timeout;
      },
      function () {
        var integrationOutputPath = path.join(__dirname, 'Integration2.out');
        
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