control.controller('LoginCtrl', function($scope, $rootScope, AUTH_EVENTS, AuthService, localStorageService, flash) {
    $scope.credentials = {
        email: '',
        password: ''
    };
    $scope.isLoading = false;
    $scope.login = function(credentials) {
        $scope.isLoading = true;
        AuthService.login(credentials).then(function() {
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            $scope.isLoading = false;
        }, function() {
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
            $scope.isLoading = false;
        });
    };

    (function showHelpForLoggingIn () {
        if (localStorageService.get('showed-login-help')) {
            return;
        }
        flash.to('alert-general').info = 'It looks like it is the first time you\'re here! You can log in with your client area credentials.';
        localStorageService.set('showed-login-help', true);
    }());

}).constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    logoutFailed: 'auth-logout-failed',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized',
    badRequest: 'auth-bad-request'
}).constant('USER_ROLES', {
    all: '*',
    admin: 'admin',
    user: 'user',
    public: 'public'
});