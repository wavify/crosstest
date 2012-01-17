var async = require('async'),
    spawn = require('child_process').spawn,
    fs = require('fs'),
    path = require('path');
    
var TestIt = require('test_it');

var ResultRender = require('../util').ResultRender;
var patterns = {
  suite: /Test Suite '.+' started./,
  begin: /^Starting .+$/i,
  success: /OK \(\d+\.\d+s\)/i,
  fail: /FAIL \(\d+.\d+s\)/i,
  detail: {
    name: /^\s*Name: .+$/i,
    file: /^\s*File: .+$/,
    line: /^\s*Line: \d+.*$/i,
    reason: /^\s*Reason: .+$/i
  }
}

var GHUnitRunner = function (directory, target) {
  this.directory = directory;
  this.target = target || 'Tests';
  this.verbose = path.existsSync(path.join(directory, '.verbose'));
  
  var files = fs.readdirSync(directory);
  var descriptionDirectory = null;
  for (var index in files) {
    if (/\.xcodeproj$/.test(files[index])) {
      descriptionDirectory = files[index];
      break;
    }
  }
  
  if (descriptionDirectory) {
    
    var pbxproj = path.join(directory, descriptionDirectory, 'project.pbxproj');
    var lines = fs.readFileSync(pbxproj, 'utf8').split('\n');
    
    var iphonePattern = /SDKROOT = iphoneos;/;
    var macosPattern = /SDKROOT = macosx;/;
    
    this.type = null;
    
    for (var index in lines) {
      if (iphonePattern.test(lines[index])) {
        this.type = 'iphone';
        break;
      } else if (macosPattern.test(lines[index])) {
        this.type = 'macos';
        break;
      }
    }
    
  }
  
}

GHUnitRunner.prototype.run = function (callback) {
  callback = callback || function () {};
  
  var directory = this.directory;
  var target = this.target;
  var verbose = this.verbose;
  
  var self = this;
  var total = { pass: 0, fail: 0, error: 0 };
  
  var environment = process.env;
  environment['GHUNIT_CLI'] = '1';
  
  var currentSuite = '';
  var currentCase = '';
  var currentError = '';
  
  var aggregate = function (data) {
    var trim = data.replace(/^\s+|\s+$/, '');
    var lines = trim.split('\n');
    
    for (var index in lines) {
      var line = lines[index];
      var output = null;
      
      if (patterns.suite.test(line)) {
        currentSuite = line.substring('Test Suite '.length + 1, line.lastIndexOf('\''));
        total.name = currentSuite;
      } else if (patterns.begin.test(line)) {
        currentCase = line;
      } else if (patterns.success.test(line)) {
        total.pass++;
        output = currentSuite + ': ' + currentCase.substring('Starting '.length) + ': pass';
      } else if (patterns.fail.test(line)) {
        total.fail++;
        output = currentSuite + ': ' + currentCase.substring('Starting '.length) + ': fail\n';
        output += currentError;
        currentError = '';
      } else {
        for (var key in patterns.detail) {
          if (patterns.detail[key].test(line)) {
            currentError += ' ' + line.replace(/^\s+|\s+$/i) + '\n';
            break;
          }
        }
      }
      
      if (output) {
        console.log (output);
        output = null;
      } else if (verbose) {
        console.log (line);
      }
    }
  }
  
  if (this.type) {
    
    var arguments = [];
    if (this.type == 'iphone') {
      arguments = [ '-target', target, '-configuration', 'Debug', '-sdk', 'iphonesimulator', 'build'];
    } else if (this.type = 'macos') {
      arguments = [ '-target', target, '-configuration', 'Debug', '-sdk', 'macosx', 'build'];
    }
    
    var builder = spawn('xcodebuild', arguments, 
      {
        cwd: directory,
        env: environment
      });
    builder.stdout.setEncoding('utf8');
    builder.stdout.on('data', aggregate);

    builder.stderr.setEncoding('utf8');
    builder.stderr.on('data', aggregate);

    builder.on('exit', function (code) {
      new ResultRender(total).render();
      callback();
    });
  } else {
    console.error ('This is not XCode project');
  }
  
}

exports.GHUnitRunner = GHUnitRunner;