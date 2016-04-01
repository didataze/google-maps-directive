"use strict";

angular.module('app', [])

    .controller('Ctrl', function ($scope) {
        $scope.maps = [
            {center: {lat: 47.211, lng: -1.566}, zoom: 12, label: "Nantes"},
            {center: {lat: 37.423, lng: -122.086}, zoom: 9, label: "Francisco"}
        ];
    })

    .directive('gmaps', function ($timeout) {
        return {
            restrict: 'AE',
            templateUrl: 'gmaps.html',
            transclude: true,
            scope: {
                center: '=',
                zoom: '='
            },
            link: function (scope, element, attrs) {

                // element.addClass('gmaps');
                var div = element.find('div')[0];

                // var map = new google.maps.Map(element[0], {
                var map = new google.maps.Map(div, {
                    center: scope.center,
                    zoom: scope.zoom
                });

                scope.$watch('zoom', function () {
                    map.setZoom(scope.zoom);
                });
                scope.$watch('center', function () {
                    map.setCenter(scope.center);
                }, true);

                google.maps.event.addListener(map, 'zoom_changed', function () {
                    scope.$applyAsync(function () {
                        scope.zoom = map.getZoom();
                    });
                });
                google.maps.event.addListener(map, 'center_changed', function () {
                    scope.$applyAsync(function () {
                        scope.center.lat = map.getCenter().lat();
                        scope.center.lng = map.getCenter().lng();
                    });
                });

                scope.positions = [];

                scope.goto = function(pos){
                    scope.center.lat = pos.lat;
                    scope.center.lng = pos.lng;
                    scope.zoom = pos.zoom;
                    scope.markerLabel = pos.label;

                };

                scope.addMarker = function () {
                    scope.positions.push({
                        lat: scope.center.lat,
                        lng: scope.center.lng,
                        zoom: scope.zoom,
                        label: scope.markerLabel
                    });

                    new google.maps.Marker({
                        position: scope.center,
                        map: map,
                        title: scope.markerLabel
                    });
                    scope.markerLabel = '';
                }

            }
        };
    });
