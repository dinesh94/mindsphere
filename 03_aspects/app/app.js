'use strict';

var app = angular.module("myApp", ["ngRoute", "chart.js", "g1b.datetime-range"]);
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "views/main.html"
    });
});

app.filter('fromNow', function () {
    return function (date) {
        return moment(date).fromNow();
    }
});
