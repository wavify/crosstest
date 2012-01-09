var instances = {};

var Collector = function () {
  var self = this;
  
  self.data = [];
  self.append = function (input) {
    console.log (input);
    self.data.push(input);
  }
}

exports.getInstance = function (key) {
  if (!instances[key]) {
    instances[key] = new Collector();
  }
  
  return instances[key];
}