'use strict';

// Register `master` component, along with its associated controller and template
angular.
  module('master').
  component('master', {
    templateUrl: 'master/master.template.html',
    controller: function MasterController() {
      var self = this;
    }
  });
