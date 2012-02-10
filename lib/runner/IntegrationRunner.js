var async = require('async'),
    spawn = require('child_process').spawn,
    fs = require('fs'),
    path = require('path');
    
var TestIt = require('test_it');

var ResultRender = require('../util').ResultRender;
var patterns = require('../util').patterns;

var out = require('../util').out;

var IntegrationRunner = function (prefix, directory) {
  
  var prepare = [];
  
  var files = fs.readdirSync(directory);
  for (var index in files) {
    
    var pattern = new RegExp('^' + prefix);
    if (pattern.test(files[index])) {
      
      var filePath = path.join(directory, files[index]);
      var stat = fs.statSync(filePath);
      
      if (path.existsSync(filePath) && !stat.isDirectory()) {
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
  this.verbose = path.existsSync(path.join(directory, '.verbose'));
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
        
        var render = function (data) {
          var line = data.replace(/^\s+|\s+$/, '');
          var lines = line.split('\n');
          
          if (self.verbose) {
            out (line);
          }
          
          for (var i in lines) {
            var print = self.verbose ? false : true;
            
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
              out (lines[i]);
            }
          }
        }
        
        ct.stdout.setEncoding('utf8');
        ct.stdout.on('data', render);
        
        ct.stderr.setEncoding('utf8');
        ct.stderr.on('data', render);
        
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