var async = require('async'),
    fs = require('fs'),
    path = require('path');
    
var TestIt = require('test_it');

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
  
  async.forEachSeries(self.prepare, 
    function (input, callback) {
      
      if (input) {
        var name = input.name;
        var object = input.test;

        if (object) {
          if (object['after all']) {
            var origin = object['after all'];
            object['after all'] = function (test) {
              origin(test);
              callback.call(self);
            }
          } else {
            object['after all'] = function (test) {
              callback.call(self);
            };
          }
          
          TestIt(name, object);
        } 
        
      } else {
        callback();
      }
      
    },
    function (error) {
      callback();
    })
}

exports.IntegrationRunner = IntegrationRunner;