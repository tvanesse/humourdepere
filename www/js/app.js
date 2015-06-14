angular.module('hdp-mobile', [
  'ionic',
  'hdp.controllers'
  ])

.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/");

  $stateProvider

    .state('main', {
      abstract: true,
      templateUrl: 'templates/main.html'
    })

    .state('main.shuffle', {
      url: '/',
      views: {
        'menuContent': {
          templateUrl: 'templates/shuffle.html'
        }
      }
    })

    .state('main.newJoke', {
      url: '/new-joke',
      views: {
        'menuContent': {
          templateUrl: 'templates/jokeForm.html'
        }
      }
    })

    .state('main.login', {
      url: '/login',
      views: {
        'menuContent': {
          templateUrl: 'templates/login.html'
        }
      }
    })

})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
