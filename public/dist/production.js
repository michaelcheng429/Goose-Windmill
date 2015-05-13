angular.module('hack.authService', [])

.factory('Auth', ["$http", "$location", "$window", function ($http, $location, $window) {
  var signin = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signin',
      data: user
    })
    .then(function (resp) {
      return resp.data;
    });
  };

  var signup = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/signup',
      data: user
    })
    .then(function (resp) {
      return resp.data;
    });
  };

  var isAuth = function () {
    return !!$window.localStorage.getItem('com.hack');
  };

  var signout = function () {
    $window.localStorage.removeItem('com.hack');
    $window.localStorage.removeItem('hfUsers');
  };


  return {
    signin: signin,
    signup: signup,
    isAuth: isAuth,
    signout: signout
  };
}]);
// HOW OUR FOLLOWING SYSTEM WORKS:
// We want users to be able to follow people before they even
// log in, because who actually has time to decide on a username/password?

// So, we do this by saving the users that they follow into localStorage.
// On signup, we'll send the users string in localStorage to our server
// which wil save them to a database.

angular.module('hack.followService', ['angular-jwt'])

.factory('Followers',  ["$http", "$window", "jwtHelper", "Links", function($http, $window, jwtHelper, Links) {
  var following = [];

  var updateFollowing = function(){
    
    // refresh personal stories
    Links.getPersonalStories(following);
    // update localStorage
    $window.localStorage.setItem('hfUsers', following);

    var token = $window.localStorage.getItem('com.hack');
    var user;
    if (!!token) {
      user = jwtHelper.decodeToken(token).user;
    }

    if(!!user){
      var data = {
        username: user,
        following: following
      };

      $http({
        method: 'POST',
        url: '/api/users/updateFollowing',
        data: data
      });
    }
  };

  var addFollower = function(username){

    if (following.indexOf(username) === -1) {
      following.push(username);
      // makes call to database to mirror our changes
      updateFollowing();
    }

  };

  var removeFollower = function(username){

    if (following.indexOf(username) > -1) {
      following.splice(following.indexOf(username), 1);
      // makes call to database to mirror our changes
      updateFollowing();
    }

  };

  var localStorageUsers = function(){
    return $window.localStorage.getItem('hfUsers');
  }


  // this function takes the csv in localStorage and turns it into an array.
  // There are pointers pointing to the 'following' array. The 'following' array
  // is how our controllers listen for changes and dynamically update the DOM.
  // (because you can't listen to localStorage changes)
  var localToArr = function(){
    // if(!localStorageUsers()){
    //   // If the person is a new visitor, set pg and sama as the default
    //   // people to follow. Kinda like Tom on MySpace. Except less creepy.
    //   $window.localStorage.setItem('hfUsers', 'pg,sama');
    // }
    if (localStorageUsers()) {
      var users = localStorageUsers().split(",");
      return users;
    }
  }

  var init = function(saved_followers){
    var users = saved_followers || localToArr();
    following.splice(0, following.length);
    following.push.apply(following, users);    
    // refresh personal stories
    Links.getPersonalStories(following);
    $window.localStorage.setItem('hfUsers', following);
  };

  init();

  return {
    following: following,
    addFollower: addFollower,
    removeFollower: removeFollower,
    localToArr: localToArr,
    init: init
  }
}])

angular.module('hack.linkService', [])

.factory('Links', ["$http", "$interval", function($http, $interval) {
  var personalStories = [];
  var topStories = [];

  var getTopStories = function() {
    var url = '/api/cache/topStories'

    return $http({
      method: 'GET',
      url: url
    })
    .then(function(resp) {

      // Very important to not point topStories to a new array.
      // Instead, clear out the array, then push all the new
      // datum in place. There are pointers pointing to this array.
      topStories.splice(0, topStories.length);
      topStories.push.apply(topStories, resp.data);
    });
  };

  var getPersonalStories = function(usernames){
    var query = 'http://hn.algolia.com/api/v1/search_by_date?hitsPerPage=500&tagFilters=(story,comment),(';
    var csv = arrToCSV(usernames);

    query += csv + ')';

    return $http({
      method: 'GET',
      url: query
    })
    .then(function(resp) {
      angular.forEach(resp.data.hits, function(item){
        // HN Comments don't have a title. So flag them as a comment.
        // This will come in handy when we decide how to render each item.
        if(item.title === null){
          item.isComment = true;
        }
      });

      // Very important to not point personalStories to a new array.
      // Instead, clear out the array, then push all the new
      // datum in place. There are pointers pointing to this array.
      personalStories.splice(0, personalStories.length);
      personalStories.push.apply(personalStories, resp.data.hits);
    });
  };

  var arrToCSV = function(arr){
    var holder = [];

    for(var i = 0; i < arr.length; i++){
      holder.push('author_' + arr[i]);
    }

    return holder.join(',');
  };

  var init = function(){

    $interval(function(){
      getTopStories();
    }, 300000);
  };

  init();

  return {
    getTopStories: getTopStories,
    getPersonalStories: getPersonalStories,
    personalStories: personalStories,
    topStories: topStories
  };
}]);



angular.module('hack.auth', [])

.controller('AuthController', ["$scope", "$window", "$location", "Auth", "Followers", 
  function ($scope, $window, $location, Auth, Followers) {
  
  $scope.user = {};
  $scope.newUser = {};
  $scope.loggedIn = Auth.isAuth();
  $scope.badLogin = false;
  $scope.badLoginMessage = '';
  $scope.badSignup = false;
  $scope.badSignupMessage = '';

  $scope.signin = function () {
    Auth.signin($scope.user)
      .then(function (data) {
        $scope.badLogin = false;
        $scope.badLoginMessage = '';
        $scope.badSignup = false;
        $scope.badSignupMessage = '';
        $window.localStorage.setItem('com.hack', data.token);
        $window.localStorage.setItem('hfUsers', data.followers)

        Followers.init(data.followers.split(","));

        $scope.loggedIn = true;
        $scope.user = {};
      })
      .catch(function (error) {
        $scope.badSignup = false;
        $scope.badSignupMessage = '';
        $scope.badLogin = true;
        $scope.badLoginMessage = error;
        console.error(error);
      });
  };

  $scope.signup = function () {
    $scope.newUser.following = Followers.following.join(',');

    Auth.signup($scope.newUser)
      .then(function (data) {
        $scope.badLogin = false;
        $scope.badLoginMessage = '';
        $scope.badSignup = false;
        $scope.badSignupMessage = '';
        $window.localStorage.setItem('com.hack', data.token);

        $scope.loggedIn = true;
        $scope.newUser = {};
      })
      .catch(function (error) {
        $scope.badLogin = false;
        $scope.badLoginMessage = '';
        $scope.badSignup = true;
        $scope.badSignupMessage = error;
        console.error(error);
      });
  };

  $scope.logout = function () {
    Followers.init();
    Auth.signout();
    $scope.loggedIn = false;
  }
}]);

angular.module('hack.currentlyFollowing', [])

.controller('CurrentlyFollowingController', ["$scope", "Followers", function ($scope, Followers) {
  $scope.currentlyFollowing = Followers.following;

  $scope.unfollow = function(user){
    Followers.removeFollower(user);
    $scope.currentlyFollowing = Followers.following;
  };

  $scope.follow = function(user){
    Followers.addFollower(user);
    $scope.newFollow = "";
    $scope.currentlyFollowing = Followers.following;
  };
}]);

angular.module('hack.personal', [])

.controller('PersonalController', ["$scope", "$window", "Links", "Followers", function ($scope, $window, Links, Followers) {
  $scope.stories = Links.personalStories;
  $scope.users = Followers.following;
  $scope.perPage = 30;
  $scope.index = $scope.perPage;

  var init = function(){
    fetchUsers();
  };
  
  var fetchUsers = function(){
    Links.getPersonalStories($scope.users);
  };
  
  init();
}]);

angular.module('hack.tabs', [])

.controller('TabsController', ["$scope", "$window", "Links", "Followers", function ($scope, $window, Links, Followers) {
  // If a user refreshes when the location is '/personal',
  // it will stay on '/personal'.
  var hash = $window.location.hash.split('/')[1];
  hash = !hash ? 'all' : hash;
  $scope.currentTab = hash;

  // What is angle? Don't worry. This just makes the 
  // refresh button do a cool spin animation. We splurged.
  $scope.angle = 360;

  $scope.changeTab = function(newTab){
    $scope.currentTab = newTab;
  };

  $scope.refreshs = function(){
    console.log('hereeeee');
    Links.getTopStories();
    Links.getPersonalStories(Followers.following);
    $scope.angle += 360;
  };
}]);

angular.module('hack.topStories', [])

.controller('TopStoriesController', ["$scope", "$window", "Links", "Followers", function ($scope, $window, Links, Followers) {
  angular.extend($scope, Links);
  $scope.stories = Links.topStories;
  $scope.perPage = 30;
  $scope.index = $scope.perPage;

  $scope.currentlyFollowing = Followers.following;

  $scope.getData = function() {
    Links.getTopStories();
  };
  
  $scope.addUser = function(username) {
    Followers.addFollower(username);
  };

  $scope.getData();
}]);


angular.module('hack', [
  'ngRoute',
  'hack.topStories',
  'hack.personal',
  'hack.currentlyFollowing',
  'hack.linkService',
  'hack.authService',
  'hack.followService',
  'hack.tabs',
  'hack.auth',
])

.config(["$routeProvider", "$httpProvider", function($routeProvider, $httpProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'app/topStories/topStories.html',
      controller: 'TopStoriesController'
    })
    .when('/personal', {
      templateUrl: 'app/personal/personal.html',
      controller: 'PersonalController'
    })
    .otherwise({
      redirectTo: '/'
    });

  $httpProvider.interceptors.push(['$q', '$location', '$window', function($q, $location, $window) {
    return {
      'request': function (config) {
        if (config.url.indexOf('algolia') === -1) {
          config.headers = config.headers || {};
          if ($window.localStorage.getItem('com.hack')) {
              config.headers.Authorization = 'Bearer ' + $window.localStorage.getItem('com.hack');
              config.headers['x-access-token'] = $window.localStorage.getItem('com.hack');
          }
        }
        return config;
      },
      'responseError': function(response) {
          if(response.status === 401 || response.status === 403) {
              $location.path('/signin');
          }
          return $q.reject(response);
      }
    };
  }]);
}])

.filter('fromNow', function(){
  return function(date){
    return humanized_time_span(new Date(date));
  }
})

.filter('htmlsafe', ['$sce', function ($sce) { 
  return function (text) {
    return $sce.trustAsHtml(text);
  };    
}])

.directive('rotate', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      scope.$watch(attrs.degrees, function (rotateDegrees) {
        var r = 'rotate(' + rotateDegrees + 'deg)';
        console.log(r);
        element.css({
          '-moz-transform': r,
          '-webkit-transform': r,
          '-o-transform': r,
          '-ms-transform': r
        });
      });
    }
  }
});