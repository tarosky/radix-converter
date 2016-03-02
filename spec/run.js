(function () {
  'use strict';

  var Jasmine = require('jasmine');
  var jasmine = new Jasmine();
  jasmine.loadConfigFile('spec/support/jasmine.json');
  jasmine.configureDefaultReporter({});
  var reporters = require('jasmine-reporters');
  jasmine.addReporter(new reporters.JUnitXmlReporter({
    savePath: process.env.CIRCLE_TEST_REPORTS || (__dirname + '/../build/'),
    consolidateAll: false,
  }));
  jasmine.execute();
}());
