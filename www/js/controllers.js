/* global angular, document, window */
'use strict';

angular.module('starter.controllers', [])
.constant('ApiEndpoint', {
        url: 'http://192.168.1.5:5000/'
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


.controller('GalleryCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion,VideoService,localStorageService,$ionicLoading) {
        var skip = localStorageService.get("skip");
        var videos = localStorageService.get("videos");
        var total = localStorageService.get("total");

        if (skip == null ) {
            skip = 0;
            videos = [];
            total = 0;
            setTimeout(function () {
                $ionicLoading.show({
                    content: '<i class="icon ion-loading-c"></i>',
                    animation: 'fade-in',
                    showBackdrop: false,
                    maxWidth: 50,
                    showDelay: 1000
                });
                VideoService.getAllVideoByCategoryFirstTime(skip).then(
                    function (response) {
                        var videoResponse = response.data;
                        var totalResponse;
                        for (var x in videoResponse) {
                            videos.push(videoResponse[x]);
                            totalResponse = videoResponse[x].total;
                        }
                        var newskip = localStorageService.get("skip") + 5;
                        localStorageService.set("skip",newskip);
                        localStorageService.set("videos",videos);
                        localStorageService.set("total",totalResponse);
                        $scope.videos = videos;
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
                        $ionicLoading.hide();
                    }, function (data) {
                        $ionicLoading.hide();
                        alert("Server Error !!! Can not get video first time");
                    });
            }, 1000);
        }



        $scope.loadMoreVideo = function () {
            $ionicLoading.show({
                content: '<i class="icon ion-loading-c"></i>',
                animation: 'fade-in',
                showBackdrop: false,
                maxWidth: 50,
                showDelay: 1000
            });

            setTimeout(function () {
                var skip = localStorageService.get("skip");
                VideoService.getAllVideoByCategory(skip).then(
                    function (response) {
                        var videoResponse = response.data;
                        for (var x in videoResponse) {
                            videos.push(videoResponse[x]);
                        }
                        var newskip = localStorageService.get("skip") + 5;
                        localStorageService.set("skip",newskip);
                        localStorageService.set("videos",videos);
                        $scope.videos = videos;
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        $ionicLoading.hide();
                    }, function (data) {
                        alert("Da xay ra ket noi voi may chu");
                        $ionicLoading.hide();
                    });
            }, 1000);
        };

        $scope.canWeLoadMoreVideo = function () {
            var skip = localStorageService.get("skip");
              if(skip == 0 || skip == null) {
                  return true;
              } else {
                  var total = localStorageService.get("total");
                  return (videos.length < total) ? true : false;
              }
        }

        $scope.playVideo = function (url) {
            YoutubeVideoPlayer.openVideo(url);
        }

})
.service('VideoService',['$http','$log','ApiEndpoint',function ($http,$log,ApiEndpoint){
        this.getAllVideoByCategoryFirstTime = function (skip) {
            var requestVideo = {};
            requestVideo.skip = skip;
            var promise = $http({
                method: 'POST',
                url: ApiEndpoint.url+'getAllVideoFirstTime',
                data: requestVideo
            }).success(function (data) {

            }).error(function (data, status, headers, config) {
                //  $log.log(data);
                alert("Da xay ra ket noi voi may chu")
            });
            return promise;
        }

        this.getAllVideoByCategory = function (skip) {
            var requestVideo = {};
            requestVideo.skip = skip;

            var promise = $http({
                method: 'POST',
                url: ApiEndpoint.url+'getAllVideoByCategory',
                data: requestVideo
            }).success(function (data) {

            }).error(function (data, status, headers, config) {
                $log.log(data);
                alert("loi")
            });
            return promise;
        }


}]);
