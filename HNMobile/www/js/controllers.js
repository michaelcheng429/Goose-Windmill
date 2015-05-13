angular.module('hack.controllers', [])

.controller('AppCtrl', function($scope, Links, Followers) {
  $scope.users = Followers.following;

  $scope.updatePersonal = function() {
    Links.getPersonalStories($scope.users);
  }
})

.controller('TopStoriesCtrl', function($scope, Links, Followers) {
  $scope.Math = window.Math;

  angular.extend($scope, Links);
  $scope.stories = Links.topStories;
  $scope.perPage = 5;
  $scope.index = $scope.perPage;

  $scope.currentlyFollowing = Followers.following;

  var storiesCopy = $scope.stories.slice();
  $scope.storiesMostPoints = storiesCopy;

  $scope.getData = function() {
    Links.getTopStories();
    $scope.$broadcast('scroll.refreshComplete');
    $scope.$broadcast('scroll.refreshComplete');
  };
  
  $scope.addUser = function(username) {
    Followers.addFollower(username);
  };

  $scope.loadMore = function() {
    $scope.index = $scope.index + $scope.perPage;
    $scope.$broadcast('scroll.infiniteScrollComplete');
  };

  $scope.openUrl = function(url, objectID) {
    var link = url ? url : 'https://news.ycombinator.com/item?id=' + objectID;
    window.open(link, '_system', 'location=yes');
    return false;
  };

  $scope.loadComments = function(storyID) {
    Links.getComments(storyID);
    console.log(Links.comments);
  };

  $scope.getData();
})

.controller('PersonalCtrl', function($scope, Links, Followers) {

  $scope.Math = window.Math;

  $scope.stories = Links.personalStories;
  $scope.users = Followers.following;
  $scope.perPage = 3;
  $scope.index = $scope.perPage;

  var init = function(){
    fetchUsers();
  };
  
  var fetchUsers = function(){
    Links.getPersonalStories($scope.users);

    $scope.$broadcast('scroll.refreshComplete');
  };
  
  init();

  // ***** 

  $scope.currentlyFollowing = Followers.following;

  $scope.unfollow = function(user){
    Followers.removeFollower(user);
    Links.getPersonalStories($scope.users);
  };

  $scope.follow = function(user){
    Followers.addFollower(user);
    $scope.newFollow = "";
  };

  $scope.loadMore = function() {
    $scope.index = $scope.index + $scope.perPage;
    $scope.$broadcast('scroll.infiniteScrollComplete');
  }

})

.controller('CommentsCtrl', function($scope, Links) {
  $scope.perPage = 3;
  $scope.index = $scope.perPage;

  $scope.comments = Links.comments;

  $scope.loadMore = function() {
    $scope.index = $scope.index + $scope.perPage;
    $scope.$broadcast('scroll.infiniteScrollComplete');
  };
})

.controller('MostPointsCtrl', function($scope, Links, Followers) {
  $scope.Math = window.Math;

  angular.extend($scope, Links);
  $scope.stories = Links.topStories;
  $scope.perPage = 5;
  $scope.index = $scope.perPage;

  $scope.currentlyFollowing = Followers.following;

  $scope.storiesMostPoints = $scope.stories.slice().sort(function(a,b) {
    return b.points - a.points;
  });

  $scope.getData = function() {
    Links.getTopStories();
    $scope.$broadcast('scroll.refreshComplete');
  };
  
  $scope.addUser = function(username) {
    Followers.addFollower(username);
  };

  $scope.loadMore = function() {
    $scope.index = $scope.index + $scope.perPage;
    $scope.$broadcast('scroll.infiniteScrollComplete');
  };

  $scope.openUrl = function(url, objectID) {
    var link = url ? url : 'https://news.ycombinator.com/item?id=' + objectID;
    window.open(link, 'system', 'location=yes');
    return false;
  };

  $scope.loadComments = function(storyID) {
    Links.getComments(storyID);
    console.log(Links.comments);
  };

  $scope.getData();
})

.controller('MostCommentsCtrl', function($scope, Links, Followers) {
  $scope.Math = window.Math;

  angular.extend($scope, Links);
  $scope.stories = Links.topStories;
  $scope.perPage = 5;
  $scope.index = $scope.perPage;

  $scope.currentlyFollowing = Followers.following;

  $scope.storiesMostComments = $scope.stories.slice().sort(function(a,b) {
    return b.num_comments - a.num_comments;
  });

  $scope.getData = function() {
    Links.getTopStories();
    $scope.$broadcast('scroll.refreshComplete');
  };
  
  $scope.addUser = function(username) {
    Followers.addFollower(username);
  };

  $scope.loadMore = function() {
    $scope.index = $scope.index + $scope.perPage;
    $scope.$broadcast('scroll.infiniteScrollComplete');
  };

  $scope.openUrl = function(url, objectID) {
    var link = url ? url : 'https://news.ycombinator.com/item?id=' + objectID;
    window.open(link, 'system', 'location=yes');
    return false;
  };

  $scope.loadComments = function(storyID) {
    Links.getComments(storyID);
    console.log(Links.comments);
  };

  $scope.getData();
})

.controller('MostRecentCtrl', function($scope, $filter, Links, Followers) {
  $scope.Math = window.Math;

  angular.extend($scope, Links);
  $scope.stories = Links.topStories;
  $scope.perPage = 5;
  $scope.index = $scope.perPage;

  $scope.currentlyFollowing = Followers.following;

  $scope.storiesMostRecent = $scope.stories.slice().sort(function(a,b) {
    return new Date(b.created_at) - new Date(a.created_at);
  });

  $scope.getData = function() {
    Links.getTopStories();
    $scope.$broadcast('scroll.refreshComplete');
  };
  
  $scope.addUser = function(username) {
    Followers.addFollower(username);
  };

  $scope.loadMore = function() {
    $scope.index = $scope.index + $scope.perPage;
    $scope.$broadcast('scroll.infiniteScrollComplete');
  };

  $scope.openUrl = function(url, objectID) {
    var link = url ? url : 'https://news.ycombinator.com/item?id=' + objectID;
    window.open(link, 'system', 'location=yes');
    return false;
  };

  $scope.loadComments = function(storyID) {
    Links.getComments(storyID);
    console.log(Links.comments);
  };

  $scope.getData();
});
