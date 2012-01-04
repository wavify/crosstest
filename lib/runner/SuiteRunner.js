var fs = require('fs'),
    path = require('path');

var SuiteRunner = function (file) {
  
  
  
}

SuiteRunner.parse = function (file) {
  var output = [];
  
  if (path.existsSync(file)) {
    var object = JSON.parse(fs.readFileSync(file));
    console.log (object);
  } else {
    console.error (file + ' doesn\'t exists');
  }
  
  
  return output;
}

exports.SuiteRunner = SuiteRunner;