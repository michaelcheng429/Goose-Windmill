// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('hack', [
  'ionic',
  'hack.linkService',
  'hack.followService',
  'hack.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.topStories', {
    url: "/top-stories",
    views: {
      'menuContent': {
        templateUrl: "templates/top-stories.html",
        controller: 'TopStoriesCtrl'
      }
    }
  })

  .state('app.comments', {
    url: "/comments/:storyId",
    views: {
      'menuContent': {
        templateUrl: "templates/comments.html",
        controller: 'CommentsCtrl'
      }
    }
  })

  .state('app.mostPoints', {
    url: "/most-points",
    views: {
      'menuContent': {
        templateUrl: "templates/most-points.html",
        controller: 'MostPointsCtrl'
      }
    }
  })

  .state('app.mostComments', {
    url: "/most-comments",
    views: {
      'menuContent': {
        templateUrl: "templates/most-comments.html",
        controller: 'MostCommentsCtrl'
      }
    }
  })

  .state('app.mostRecent', {
    url: "/most-recent",
    views: {
      'menuContent': {
        templateUrl: "templates/most-recent.html",
        controller: 'MostRecentCtrl'
      }
    }
  })

  .state('app.personal', {
    url: "/personal",
    views: {
      'menuContent': {
        templateUrl: "templates/personal.html",
        controller: 'PersonalCtrl'
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/top-stories');
})

.filter('fromNow', function(){
  return function(date){
    return humanized_time_span(new Date(date));
  }
})

.filter('htmlsafe', ['$sce', function ($sce) { 
  return function (text) {
    return $sce.trustAsHtml(text);
  };    
}]);
