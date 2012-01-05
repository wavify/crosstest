var test = {
  'before all': function (test) {
    console.log ('before all');
  },
  'after all': function (test) {
    console.log ('after all');
  },
  'before each': function (test) {
    console.log ('before each');
  },
  'after each': function (test) {
    console.log ('after each');
  },
  'test first': function (test) {
    console.log ('test first');
  },
  'test second': function (test) {
    console.log ('test second');
  },
  'test third': function (test) {
    console.log ('test third');
  }
}

exports.test = test;