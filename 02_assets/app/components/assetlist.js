'use strict';

app.config(function($routeProvider) {
    $routeProvider
        .when("/assets", {
            templateUrl : "views/components/assets.html"
        });
});


app.controller('BusyIndicatorCtrl', ['$scope','$interval', function($scope, $interval) {
    var self = this;
}]);


app.controller('AssetListCtrl', ['$scope', '$http', function ($scope, $http) {
    var self = this;
    self.assets = [];
    
    self.fetchAssetsFromAssetManagement = function() {    
        var req = {
            method: 'GET',
            url: '/api/assets'
        }
        $http(req)
            .then(function(response) {
                console.log("response: " + response);
                if (response.data.hasOwnProperty('assets')) {
                    self.assets = response.data['assets'].assets;
                }
            })
        .catch(function(err) {
            console.log('Augh, there was an error!', err.statusText);
        });
    }
        
    self.fetchAssetsFromAssetManagement();
}]);