var output = [];

var test = {
  'before all': function (test) {
    output.push('before all');
  },
  
  'test first': function (test) {
    output.push('test first');
  },
  
  'test second': function (test) {
    output.push('test second');
  },
  
  'after each': function (test) {
    output.push('after each');
  }
}

exports.test = test;
exports.output = output;