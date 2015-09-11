/* global angular, document, window */
'use strict';

angular.module('starter.controllers', [])
.constant('ApiEndpoint', {
        url: 'http://128.199.101.93:3000/'
})
.controller('AppCtrl', function($scope, $ionicModal, $ionicPopover, $timeout) {
    // Form data for the login modal
    $scope.loginData = {};
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.setExpanded = function(bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function() {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function() {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function() {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };
})


.controller('GalleryCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion,VideoService) {


        setTimeout(function () {
            VideoService.getAllVideoByCategoryFirstTime("55d1bb6bf29fb19d048e8075").then(
                function (response) {
                    $scope.videos = response.data;
                    $scope.$parent.showHeader();
                    $scope.$parent.clearFabs();
                    $scope.isExpanded = true;
                    $scope.$parent.setExpanded(true);
                    $scope.$parent.setHeaderFab(false);

                    // Activate ink for controller
                    ionicMaterialInk.displayEffect();

                    ionicMaterialMotion.pushDown({
                        selector: '.push-down'
                    });
                    ionicMaterialMotion.fadeSlideInRight({
                        selector: '.animate-fade-slide-in .item'
                    });
                }, function (data) {
                    alert("Server Error !!! Can not get video first time");
                });
        }, 1000);

})
.service('VideoService',['$http','$log','ApiEndpoint',function ($http,$log,ApiEndpoint){
        this.getAllVideoByCategoryFirstTime = function (categoryID) {

            var requestVideo = {};
            requestVideo.categoryID = categoryID;
            requestVideo.skip = 0;
            console.log(requestVideo);
            var promise = $http({
                method: 'POST',
                url: ApiEndpoint.url+'getAllVideoFirstTime',
                data: requestVideo
            }).success(function (data) {

            }).error(function (data, status, headers, config) {
                //  $log.log(data);
                alert("?ã x?y ra l?i k?t n?i v?i máy ch?")
            });
            return promise;
        }
}]);
