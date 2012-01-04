var test = {
  'before all': function (test) {
    console.log ('before all');
  },
  
  'test first': function (test) {
    console.log ('test first');
  },
  
  'test second': function (test) {
    console.log ('test second');
  },
  
  'after each': function (test) {
    console.log ('after each');
  }
}

exports.test = test;