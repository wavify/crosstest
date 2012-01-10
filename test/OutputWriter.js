var fs = require('fs'),
    path = require('path');

exports.appendFileSync = function (file, data) {
  
  var position = 0;
  if (path.existsSync(file)) {
    position = fs.statSync(file).size;
  }
  
  var fd = fs.openSync(file, 'a');
  fs.writeSync(fd, data, position);
  fs.closeSync(fd);
  
}
