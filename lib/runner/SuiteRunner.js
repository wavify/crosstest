var async = require('async'),
    spawn = require('child_process').spawn,
    fs = require('fs'),
    path = require('path');
    
var TestRunner = require('./TestRunner').TestRunner;
var ResultRender = require('../util').ResultRender;
var patterns = require('../util').patterns;

var SuiteRunner = function (file) {
  this.suite = SuiteRunner.parse(file);
}

SuiteRunner.prototype.run = function (rootCallback) {
  rootCallback = rootCallback || function () {};
  var suite = this.suite;
  var total = { name: suite.name, pass: 0, fail: 0, error: 0 };
  
  async.waterfall([
    function (flowCallback) {
      if (suite.scripts &&
          suite.scripts.before &&
          suite.scripts.before.all) {
        suite.scripts.before.all(function() {
          flowCallback();
        });
      } else {
        flowCallback();
      }
    },
    function (flowCallback) {
      async.forEachSeries(suite.tests,
        function (input, callback) {
          var each = { name: input.name, pass: 0, fail: 0, error: 0 };
          async.waterfall([
            function (eachCallback) {
              if (suite.scripts &&
                  suite.scripts.before &&
                  suite.scripts.before.each) {
                suite.scripts.before.each(function () {
                  eachCallback();
                });    
              } else {
                eachCallback();
              }
            },
            function (eachCallback) {
              
              var arguments = [ input.path ];
              if (input.target) {
                arguments.push(input.target);
              }
              
              var ctPath = path.join(__dirname, '..', '..', 'bin', 'ct');
              var ct = spawn(ctPath, arguments, { cwd: '/', env: process.env });
              
              var render = function (data) {
                var line = data.toString().replace(/^\s+|\s+$/, '');
                var lines = line.split('\n');
                
                if (input.verbose) {
                  console.log (line);
                }
                
                for (var i in lines) {
                  var print = input.verbose ? false : true;
                  
                  if (patterns.pass.test(lines[i])) {
                    each.pass++;
                    total.pass++;
                  } else if (patterns.fail.test(lines[i])) {
                    each.fail++;
                    total.fail++;
                  } else if (patterns.error.test(lines[i])) {
                    each.error++;
                    total.error++;
                  } else {
                    print = false;
                  }
                  
                  if (print) {
                    console.log (lines[i]);
                  }
                }
              }
              
              ct.stdout.setEncoding('utf8');
              ct.stdout.on('data', render);
              
              ct.stderr.setEncoding('utf8');
              ct.stderr.on('data', render);
              
              ct.on('exit', function (code) {
                eachCallback();
              });
              
            },
            function (eachCallback) {
              if (suite.scripts &&
                  suite.scripts.after &&
                  suite.scripts.after.each) {
                suite.scripts.after.each(function() {
                  eachCallback();
                });
              } else {
                eachCallback();
              }
            }],
            function (error) {
              new ResultRender(each).render();
              callback();
            });
        },
        function (error) {
          flowCallback();
        });
    },
    function (flowCallback) {
      if (suite.scripts &&
          suite.scripts.after &&
          suite.scripts.after.all) {
        suite.scripts.after.all(function () {
          flowCallback();
        });
      } else {
        flowCallback();
      }
    }],
    function (error) {
      new ResultRender(total).render();
      rootCallback();
    });
  
}

SuiteRunner.parse = function (file) {
  var output = {};
  
  if (path.existsSync(file)) {
    var object = JSON.parse(fs.readFileSync(file));
    output.name = object.name;
    output.tests = [];

    if (object.scripts) {
      var base = path.dirname(file);
      var scripts = require(path.join(base, object.scripts)).scripts;
      output.scripts = scripts;
    }
    
    for (var index in object.suite) {
      var test = object.suite[index];
      var testPath = path.join(path.dirname(file), test.file);
      if (path.existsSync(testPath)) {
        test.path = testPath;
        output.tests.push(test);
      } else {
        console.error (test.file + ' doesn\'t exists');
      }
    }
    
    if (object.verbose) {
      for (var i in output.tests) {
        output.tests[i].verbose = true;
      }
    }
    
  } else {
    console.error (file + ' doesn\'t exists');
  }
  
  return output;
}

exports.SuiteRunner = SuiteRunner;