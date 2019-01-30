'use strict';

app.config(function ($routeProvider) {
    $routeProvider
        .when("/timeseries/:filter?", {
            templateUrl: "views/components/timeseries.html"
        });
});

app.controller('TimeSeriesCtrl', ['$scope', '$http', '$interval', '$routeParams', '$rootScope', function ($scope, $http, $interval, $routeParams, $rootScope) {
    var self = this;
    var scheduleId;

    $scope.hasRouteParams = false;
    $scope.title = "";

    // Datetime-range start and end parameters
    $scope.start = moment().utc().subtract(1, 'hours');
    $scope.end = moment().utc();

    // Datetime-range presets
    $scope.presets = [
        {
            'name': 'Last Hour',
            'start': moment().utc().subtract(1, 'hours'),
            'end': moment().utc(),
        }, 
        {
            'name': 'Last 24 Hours',
            'start': moment().utc().subtract(24, 'hours'),
            'end': moment(),
        }, 
        {
            'name': 'This Week',
            'start': moment().utc().startOf('week').startOf('day'),
            'end': moment().utc(),
        }, 
        {
            'name': 'This Month',
            'start': moment().utc().startOf('month').startOf('day'),
            'end': moment().utc(),
        }, 
        {
            'name': 'This Year',
            'start': moment().utc().startOf('year').startOf('day'),
            'end': moment().utc(),
        }
    ];

    // Transfered values from selected variable (assetlist)
    var filter = {};
    try {
        var filter = JSON.parse($routeParams.filter);
        $scope.hasRouteParams = true;
        $scope.title = "Variable: " + filter.variableName + "  |  Aspect: " + filter.aspectName + "  |  Asset ID: " + filter.assetId;
        $scope.chartseries = [filter.variableName]; 
    } catch (ex) {
        console.log("Error:" + ex)
        console.log({ "could not json parse:": $filter });
    }
    console.log('JSON.stringify(filter): ' + JSON.stringify(filter));
    console.log('filter.assetId: ' + filter.assetId);
    console.log('filter.aspectName: ' + filter.aspectName);
    console.log('filter.variableName: ' + filter.variableName);
    
    // Chart options
    $scope.options = {
        legend : {
            display : true
        }
    }

    $scope.onClick = function (points, evt) {
        console.log(points, evt);
        self.updateChart();
    };

    $scope.dateChangedByUser = function(){
        self.updateChart();
    }

    self.updateChart = function() {
        // Chart data to be displayed
        $scope.data = [];
        $scope.labels = [];
        $scope.chartseries = [];
        
        var fromDateTime = '?from=' + self.dateTimeString($scope.start);
        var toDateTime = '&to=' + self.dateTimeString($scope.end);
        var intervalValue = '&intervalValue=2';
        var intervalUnit = '&intervalUnit=minute';
        var selectVariable = '&select=' + filter.variableName;
        var aggrParams =  fromDateTime + toDateTime + intervalValue + intervalUnit + selectVariable;
        var timeUrl = '';

        var timeReq = {
            method: 'GET',
            url: timeUrl
        }

        $http(timeReq)
        .then(function(response) {
            console.log("response: " + response);
            var chartData = [];
            response.data.forEach(function(aggrData) {
                if(aggrData.hasOwnProperty(filter.variableName)) {
                    chartData.push(aggrData[filter.variableName].firstvalue);
                    $scope.labels.push(aggrData[filter.variableName].firsttime);
                }
            });
            if(chartData.length > 0) {
                $scope.chartseries.push(filter.variableName);
                $scope.data.push(chartData);
            }
            else {
                $scope.chartseries.push("No data");
            }
        })
        .catch(function(err) {
            console.log('Augh, there was an error!', err.statusText);
        });
    }

    // Convert moment.js (date time) object to display string
    self.dateTimeString = function(obj) {
        try {
            var displayString = obj.format('YYYY-MM-DDTHH:mm')+':00Z';
        } 
        catch (ex) {
            console.log("Error:" + ex);
            console.log("given parameter is not a moment object:" + obj);
        }
        
        return displayString;
    }

    self.updateChart();
}]);