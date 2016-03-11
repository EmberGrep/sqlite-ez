/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    codemirror: {
      modes: ['sql'],
      themes: ['lesser-dark'],
    }
  });

  return app.toTree();
};
