var myApp = angular.module("myApp", ['ngMaterial']);

myApp.controller("AppCtrl", function ($scope) {
    //selected date
    $scope.startDate = new Date();

    $scope.newEvent = {};
    $scope.nextEvent = '';
    $scope.events = [];
    $scope.remaining = '';

    //function to insert event
    $scope.addEvent = function () {

        var id = '';
        if ($scope.events.length === 0) {
            id = 1;
        } else {
            id = $scope.events[$scope.events.length - 1].id + 1;
        }

        $scope.newEvent.id = id;
        $scope.events.push($scope.newEvent);
        $scope.newEvent = {};
        $scope.message = 'New Event Added Successfully!';
        $('#addModal').modal('hide');
        $scope.getEvents();

        $scope.nextEvent = $scope.events.reduce(function (res, obj) {
            return ((obj.date <= res.date) && (obj.time <= res.time)) ? obj : res;
        });

        $scope.remaining = getDifference($scope.nextEvent.date, $scope.nextEvent.time);
    };


    //function to get events for the selected date
    $scope.getEvents = function () {

        var date = $scope.startDate.toLocaleDateString();

        $scope.todayEvents = $scope.events.filter(item => item.date.toLocaleDateString() === date);
    };


    //function to select the event
    $scope.selectEvent = function (id) {

        for (var i in $scope.events) {
            if ($scope.events[i].id == id) {
                $scope.selectedEvent = angular.copy($scope.events[i]);
            }
        }
    };

    //function to update the event
    $scope.updateEvent = function (id) {
        for (var i in $scope.events) {
            if ($scope.events[i].id == id) {
                $scope.events[i] = angular.copy($scope.selectedEvent);
                $scope.message = 'Event Updated Successfully!';
            }
        }

        $('#editModal').modal('hide');
        $scope.getEvents();
    };

    //function to delete the event
    $scope.deleteEvent = function () {
        $scope.events.splice($scope.events.indexOf($scope.selectedEvent), 1);
        $scope.message = 'Event Deleted Successfully!';
        $('#confirmModal').modal('hide');
        $scope.getEvents();
    };

    $scope.clearMessage = function (){
        $scope.message = '';
    };

    //get the next recent event
    $scope.getNextEvent = function() {
        $scope.nextEvent = $scope.events.reduce(function (res, obj) {
            return ((obj.date <= res.date) && (obj.time <= res.time)) ? obj : res;
        });

        $scope.remaining = getDifference($scope.nextEvent.date, $scope.nextEvent.time);
    };

    //check the events every second
    window.setInterval(function () {
        $scope.$apply(function () {
            let now = new Date();

            if ($scope.events.length != 0) {
                $scope.events.forEach(function (e, index) {
                    let datetime = e.date.toLocaleDateString() + ' ' + e.time.toLocaleTimeString();
                    var day = new Date(datetime);

                    if(day < now){
                        $scope.events.splice(index, 1);
                    }
                })
            }

            if ($scope.nextEvent != '' && $scope.events.length != 0) {
                //console.log($scope.remaining);
                $scope.getNextEvent();
            } else {
                $scope.nextEvent = '';
            }

            $scope.getEvents();
        });


    }, 1000);


});

//get time difference for events with current date
function getDifference(date, time) {

    let datetime = date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate() + ' ' + time.getHours()+':'+time.getMinutes()+':'+time.getSeconds();
    var day = new Date(datetime);
    var now = new Date();
    now = now.getFullYear()+'-'+now.getMonth()+'-'+now.getDate() + ' ' + now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();
    now = new Date(now);

    var diff = Math.abs(day - now);

    var ms = diff % 1000;
    diff = (diff - ms) / 1000;
    var ss = diff % 60;
    diff = (diff - ss) / 60;
    var mm = diff % 60;
    diff = (diff - mm) / 60;
    var hh = diff % 24;
    var days = (diff - hh) / 24;

    //console.log(days + " days : " + hh + " hours : " + mm + " minutes");
    return days + " days : " + hh + " hours : " + mm + " minutes : "+ ss + " seconds";
}


/*'use strict';

// Declare app level module which depends on views, and core components
angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/view1'});
}]);*/
