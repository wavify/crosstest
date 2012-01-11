var async = require('async'),
    spawn = require('child_process').spawn,
    fs = require('fs'),
    path = require('path');
    
var TestIt = require('test_it');

var ResultRender = require('../util').ResultRender;

var passPattern = /.+: .+: pass.* \(\d+ assertion(s){0,1} run\)/i;
var failPattern = /.+: .+: fail:.* \(\d+ assertion(s){0,1} run\)/i;
var errorPattern = /.+: .+: error:.* \(\d+ assertion(s){0,1} run\)/i;

var IntegrationRunner = function (prefix, directory) {
  
  var prepare = [];
  
  var files = fs.readdirSync(directory);
  for (var index in files) {
    
    var pattern = new RegExp('^' + prefix);
    if (pattern.test(files[index])) {
      
      var filePath = path.join(directory, files[index]);
      if (path.existsSync(filePath)) {
        var test = require(filePath).test;
        prepare.push({
          name: path.basename(filePath, '.js'),
          file: filePath,
          test: test
        });
      }
      
    }
    
  }
  
  this.prepare = prepare;
  
}

IntegrationRunner.prototype.run = function (callback) {
  callback = callback || function () {};
  
  var self = this;
  var total = { pass: 0, fail: 0, error: 0 };
  
  async.forEachSeries(self.prepare, 
    function (input, callback) {
      
      var each = { name: input.name, pass: 0, fail: 0, error: 0 };
      
      if (input) {

        var ctPath = path.join(__dirname, '..', '..', 'bin', 'ct');
        var ct = spawn(ctPath, [ input.file ], { cwd: '/' });
        ct.stdout.setEncoding('utf8');
        ct.stdout.on('data', function (data) {
          var line = data.replace(/^\s+|\s+$/, '');
          var lines = line.split('\n');
          
          for (var i in lines) {
            var print = true;
            
            if (passPattern.test(lines[i])) {
              each.pass++;
              total.pass++;
            } else if (failPattern.test(lines[i])) {
              each.fail++;
              total.fail++;
            } else if (errorPattern.test(lines[i])) {
              each.error++;
              total.error++;
            } else {
              print = false;
            }
            
            if (print) {
              console.log (lines[i]);
            }
          }
          
          
        });
        
        ct.on('exit', function (code) {
          new ResultRender(each).render();
          callback();
        });
        
      } else {
        callback();
      }
      
    },
    function (error) {
      new ResultRender(total).render();
      callback();
    })
}

exports.IntegrationRunner = IntegrationRunner;