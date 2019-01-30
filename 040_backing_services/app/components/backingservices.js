'use strict';

app.config(function($routeProvider) {
    $routeProvider
        .when("/backingservices/:filter?", {
            templateUrl : "views/components/backingservices.html"
        });
});

app.controller('BackingServicesCtrl', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
    var self = this;

    $scope.hasRouteParams = false;
    $scope.title = "PostGreSQL";

    $scope.assetId = "n.a.";
    $scope.assetName = "n.a.";
    $scope.bsData = "n.a.";
    $scope.bsTimestamp = "n.a.";
    var originData = $scope.bsData;
    var originTimestamp = $scope.bsTimestamp;
    
    // Transfered values from selected variable (assetlist)
    var filter = {};
    try {
        var filter = JSON.parse($routeParams.filter);
        $scope.assetId = filter.assetId;
        $scope.assetName = filter.name;
        $scope.hasRouteParams = true;
        $scope.title = $scope.title + "  |  Asset: " + filter.name + "  |  Asset ID: " + filter.assetId;
    } catch (ex) {
        console.log("Error:" + ex)
        console.log({ "could not json parse:": $filter });
    }
    console.log('JSON.stringify(filter): ' + JSON.stringify(filter));
    console.log('filter.assetId: ' + filter.assetId);
    console.log('filter.name: ' + filter.name);

    self.getBackingServiceData = function() {
        var req = {
            method: 'GET',
            url: '/get/' + $scope.assetId
        };
        $http(req)
        .then(function(response) {
            console.log("response: " + response);
            $scope.bsData = response.data[response.data.length-1].data;
            $scope.bsTimestamp = response.data[response.data.length-1].time;
            originData = $scope.bsData;
            originTimestamp = $scope.bsTimestamp;
            $scope.$apply()
        }).catch(function(err) {
            console.log('Augh, there was an error!', err.statusText);
        });
    }

    self.writeBackingServiceData = function(bsData) {
        var req = {
            method: 'GET',
            url: 'write?data=' + $scope.bsData + '&assetId=' + $scope.assetId
        };
        $http(req)
        .then(function(response) {
            console.log("response: " + response);
            $scope.bsData = response.data.data;
            $scope.bsTimestamp = response.data.time;
            originData = $scope.bsData;
            originTimestamp = $scope.bsTimestamp;
            $scope.$apply()
        }).catch(function(err) {
            console.log('Augh, there was an error!', err.statusText);
        });
    }
    
    $scope.resetData = function() {
        $scope.bsData = originData;
        $scope.bsTimestamp = originTimestamp;
    }

    $scope.submitData = function() {
        self.writeBackingServiceData();
    }

    if ($scope.hasRouteParams) {
        self.getBackingServiceData();
    }
}]);

