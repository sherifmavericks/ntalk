angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider){

$stateProvider

.state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
})

// Parent State
.state('main', {
    url: '/main',
    templateUrl: 'templates/main.html',
    abstract: true
})

    // Child States and Nested Views
    .state('main.chats', {
        url: '/chats',
        views: {
            'chats': {
                templateUrl: 'templates/chats.html',
                controller: 'chatsCtrl'
            }
        }
    })

    .state('main.contacts', {
        url: '/contacts',
        views: {
            'contacts': {
                templateUrl: 'templates/contacts.html',
                controller: 'contactsCtrl'
            }
        }
    })

    .state('main.settings', {
        url: '/settings',
        views: {
            'settings': {
                templateUrl: 'templates/settings.html',
                controller: 'settingsCtrl'
            }
        }
    })

    .state('main.chatDetails', {
        url: '/chatDetails',
        views: {
            'chatDetails': {
                templateUrl: 'templates/chatDetails.html',
                controller: 'chatDetailsCtrl'
            }
        }
    })

$urlRouterProvider.otherwise('/login');

});