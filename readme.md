Crosstest
=========

Crosstest is test command line uses to link and run test in each project with same command and style. It's also provide code pattern for javascript project.

Requirement
===========

- To use with node.js and javascript in browser. It requires [customize test_it](https://github.com/llun/test_it) version.
- To use with iOS/Mac OS project. It requires [GHUnit](http://gabriel.github.com/gh-unit).

Other framework will add in future.

Installation
============

    sudo npm install -g crosstest
    
How to run test
===============

- Node.js

Test file have to export test variable to make it runnable with Crosstest.

    export.test = {
      'before all': function (test) {
        // This method will run before all method. 
      },
      
      'before each': function (test) {
        // This method will run before invoke each test. (setup)
      },
      
      'test name': function (test) {
        // Test method
      },
      
      'after each': function (test) {
        // This method will run after each test. (teardown)
      },
      
      'after all': function (test) {
        // This method will run after all method. 
      }
    }

After create test file use `ct` command run it.

    ct file.js
    
It can run all test file with `ct <directory name>` but file must have **Test** in front of it name e.g. **TestLogin.js**

- GHUnit

Create [GHUnit target](http://gabriel.github.com/gh-unit/docs/index.html) and make it runnable in command line with this [guide](http://gabriel.github.com/gh-unit/docs/appledoc_include/guide_command_line.html). And use `ct` run it like below

    ct <project folder> <target> <class name>/<method name>
    
Class name and method name is optional. If it's not specify, Crosstest will run every class and every method.

- Suite

Crosstest also have suite file which can tell which test file need to run in group. It's json file and have format like below.

    {
      "name": "Suite name",
      "verbose": false,
      "script": "Script.js",
      "suite": [
        {
          "file": "<directory or file name>",
          "name": "Test name",
          "verbose": false
        }
      ]
    }

script property use to point to script file that define before and after execution this suite. It's javascript file and have
pattern like below.

    exports.scripts = {
      before: {
        each: function (callback) {
          // Run this before each file.
          callback()
        },
        all: function (callback) {
          // Run this before every file.
          callback()
        }
      },
      after: {
        each: function (callback) {
          // Run this after each file.
          callback()
        },
        after: function (callback) {
          // Run this after every file.
          callback()
        }
      }
    }