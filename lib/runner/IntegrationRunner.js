var async = require('async'),
    exec = require('child_process').exec,
    spawn = require('child_process').spawn,
    fs = require('fs'),
    path = require('path');
    
var TestIt = require('test_it');

var ResultRender = require('../util').ResultRender;

var passPattern = /^.+: .+: pass.* \(\d+ assertion(s){0,1} run\)$/i;
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
          if (passPattern.test(line)) {
            each.pass++;
            total.pass++;
            console.log (line);
          } else if (failPattern.test(line)) {
            each.fail++;
            total.fail++;
            console.log(line);
          } else if (errorPattern.test(line)) {
            each.error++;
            total.error++;
            console.log (line);
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