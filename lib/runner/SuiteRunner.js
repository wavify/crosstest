var async = require('async'),
    spawn = require('child_process').spawn,
    fs = require('fs'),
    path = require('path');
    
var TestRunner = require('./TestRunner').TestRunner;
var ResultRender = require('../util').ResultRender;

var passPattern = /.+: .+: pass.* \(\d+ assertion(s){0,1} run\)/i;
var failPattern = /.+: .+: fail:.* \(\d+ assertion(s){0,1} run\)/i;
var errorPattern = /.+: .+: error:.* \(\d+ assertion(s){0,1} run\)/i;

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
              var ctPath = path.join(__dirname, '..', '..', 'bin', 'ct');
              var ct = spawn(ctPath, [ input.path ], { cwd: '/' });
              
              ct.stdout.setEncoding('utf8');
              ct.stdout.on('data', function (data) {
                var line = data.toString().replace(/^\s+|\s+$/, '');
                console.log (line);
                if (passPattern.test(line)) {
                  each.pass++;
                  total.pass++;
                } else if (failPattern.test(line)) {
                  each.fail++;
                  total.fail++;
                } else if (errorPattern.test(line)) {
                  each.error++;
                  total.error++;
                }
              });
              
              ct.stderr.on('data', function (data) {
                var line = data.toString().replace(/^\s+|\s+$/, '');
                console.error (line);
                if (passPattern.test(line)) {
                  each.pass++;
                  total.pass++;
                } else if (failPattern.test(line)) {
                  each.fail++;
                  total.fail++;
                } else if (errorPattern.test(line)) {
                  each.error++;
                  total.error++;
                }
              });
              
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
    
  } else {
    console.error (file + ' doesn\'t exists');
  }
  
  return output;
}

exports.SuiteRunner = SuiteRunner;