'use strict';

// Register `plants` component, along with its associated controller and template
angular.module('plants').component('plants', {
  templateUrl: 'plants/plants.template.html',
  controller: function PlantsController($scope) {
    var self = this;

    self.plants = [];

    var apigClient = apigClientFactory.newClient(AWS.config.credentials);

    var params = {};

    var body = {};

    apigClient.plantsGet(params, body)
      .then(function (result) {
        console.log("Success: " + JSON.stringify(result.data));
        self.plants = result.data.plants;
        $scope.$apply();
      }).catch(function (result) {
        console.log("Error: " + JSON.stringify(result));
    });
  }
});
