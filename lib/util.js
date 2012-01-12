var ResultRender = function (result) {
  this.result = result;
}

ResultRender.prototype.render = function () {
  var result = this.result;
  
  var color = '\033[32m';
  var suffix = '\033[39m';
  var prefix = 'Pass.';
  var pass = true;
  
  var text = ' (' + (result.pass + result.fail + result.error) + ' tests:';
  if (result.pass > 0) {
    text += ' ' + result.pass + ' passed,';
  }
  
  if (result.fail > 0) {
    color = '\033[31m';
    prefix = 'Fail.';
    text += ' ' + result.fail + ' failed,';
    pass = false;
  }
  
  if (result.error > 0) {
    color = '\033[31m';
    prefix = 'Error!';
    text += ' ' + result.error + ' errored,';
    pass = false;
  }
  
  text = text.substring(0, text.length - 1);
  
  if (result.name) {
    prefix = result.name + ': ' + prefix;
  }
  
  var nocolor = prefix + text + ')';
  text = color + nocolor + suffix;
  console.log (text);
}

exports.ResultRender = ResultRender;
exports.patterns = {
  pass: /.+: .+: pass(.* \(\d+ assertion(s){0,1} run\))*/i,
  fail: /.+: .+: fail(:.* \(\d+ assertion(s){0,1} run\))*/i,
  error: /.+: .+: error(:.* \(\d+ assertion(s){0,1} run\))*/i
}
