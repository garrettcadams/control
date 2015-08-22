angular.module('control.manage.extra-services').run(function (ManageService) {
    ManageService.addItem({
        sectionId: 'extra-services',
        name: '#NowPlaying',
        icon: 'twitter',
        route: {
            subPathName: 'now-playing-tweets',
            name: 'nowPlayingTweets',
            template: '/app/manage/extra-services/now-playing-tweets/now-playing-tweets.html',
            controller: 'NowPlayingTweetsCtrl',
            title: '#NowPlaying Tweets',
            resolve: /*@ngInject*/ {
                settings: function (NowPlayingTweetsService, $q) {
                    return NowPlayingTweetsService.getSettings().then(function (settings) {
                        return $q.resolve(settings);
                    }, function () {
                        return $q.resolve({});
                    });
                },
            },
        },
    });
});
