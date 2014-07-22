define(['control'], function (control) {
    'use strict';
    control.controller('RequestAppCtrl', function ($scope, RequestAppService, $upload, ENV, $routeParams, services, $location, flash) {

        var rejectRequest = function (message) {
            $location.path('/manage');
            flash.to('alert-general').error = message;
        };

        // Check whether the user is allowed to submit a request for the requested service
        var username = $routeParams.username,
            canRequest = false,
            i;

        for (i = 0; i < services.length; i++) {
            if (services[i].username === username) {
                $scope.service = services[i];
                canRequest = true;
                break;
            }
        }

        if (!canRequest) {
            rejectRequest('You don\'t have permission to do that.');
        }

        if ($scope.service.name === 'Free') {
            rejectRequest('Free servers are not eligible for mobile apps. Please consider upgrading!');
        }

        if ($scope.service.hasiOSApp && $scope.service.hasAndroidApp) {
            rejectRequest('You have already requested apps for server #' + $scope.service.id + '.');
        }

        if (['Terminated', 'Suspended', 'Cancelled', 'Pending'].indexOf($scope.service.status) > -1) {
            rejectRequest('You can\'t request apps for server #' + $scope.service.id + ' as it is not active.');
        }

        if ($scope.service.group.toLowerCase().indexOf('cast') === -1) {
            rejectRequest('You can\'t request apps for server #' + $scope.service.id + ' as it is not a streaming server.');
        }

        var onAppSubmitted = function () {
            $scope.appSubmitted = true;
        };

        $scope.appSubmitted = false;
        $scope.request = {};

        $scope.submit = function (request) {
            request.username = $scope.service.username;
            switch (request.platform) {
                case 'Both':
                    RequestAppService.submit('Android', request).then(onAppSubmitted);
                    RequestAppService.submit('iOS', request).then(onAppSubmitted);
                    break;
                case 'Android':
                    RequestAppService.submit('Android', request).then(onAppSubmitted);
                    break;
                case 'iOS':
                    RequestAppService.submit('iOS', request).then(onAppSubmitted);
                    break;
            }
        };

        // upload stuff
        $scope.onIconUpload = function ($files) {
            $scope.isUploadingIcon = true;
            $scope.uploadProgressIcon = 0;
            $scope.upload = $upload.upload({
                url: 'https://' + ENV.apiEndpoint + '/control/apps/iconupload/',
                method: 'POST',
                data: {},
                file: $files[0]
            })
            .progress(function (evt) {
                $scope.uploadProgressIcon = parseInt(100.0 * evt.loaded / evt.total, 10);
            })
            .success(function (data) {
                $scope.isUploadingIcon = false;
                $scope.iconUploaded = true;
                $scope.request.icon = data.name;
            });
        };

        $scope.onLogoUpload = function ($files) {
            $scope.isUploadingLogo = true;
            $scope.uploadProgressLogo = 0;
            $scope.upload = $upload.upload({
                url: 'https://' + ENV.apiEndpoint + '/control/apps/logoupload/',
                method: 'POST',
                data: {},
                file: $files[0]
            })
            .progress(function (evt) {
                $scope.uploadProgressLogo = parseInt(100.0 * evt.loaded / evt.total, 10);
            })
            .success(function (data) {
                $scope.isUploadingLogo = false;
                $scope.logoUploaded = true;
                $scope.request.logo = data.name;
            });
        };
    });
});