var MockConsole = {
  output: '',
  error: '',
  
  setup: function (stdio) {
    var output = stdio.log;
    var error = stdio.error;
    
    stdio.log = function (message) {
      MockConsole.output += message.toString() + '\n';
      output.call(stdio, message);
    }
    
    stdio.error = function (message) {
      MockConsole.error += message.toString() + '\n';
      error.call(stdio, message);
    }
    
  },
  reset: function () {
    MockConsole.output = '';
    MockConsole.error = '';
  }
  
}

exports.MockConsole = MockConsole;