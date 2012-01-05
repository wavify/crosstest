var fs = require('fs'),
    path = require('path');

fs.readdir(__dirname, function (error, files) {
  
  var prepare = [];
  for (var index in files) {
    if (/^Test/.test(path.basename(files[index]))) {
      require(path.join(__dirname, files[index]));
    }
  }
  
});