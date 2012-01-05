var output = [];

var test = {
  'before all': function (test) {
    output.push('before all');
  },
  'after all': function (test) {
    output.push('after all');
  },
  'before each': function (test) {
    output.push('before each');
  },
  'after each': function (test) {
    output.push('after each');
  },
  'test first': function (test) {
    output.push('test first');
  },
  'test second': function (test) {
    output.push('test second');
  },
  'test third': function (test) {
    output.push('test third');
  }
}

exports.test = test;
exports.output = output;