angular.module('hack.topStories', [])

.controller('TopStoriesController', function ($scope, $window, Links, Followers, ezfb) {
  angular.extend($scope, Links);
  $scope.stories = Links.topStories;
  console.log($scope.stories);
  $scope.perPage = 30;
  $scope.index = $scope.perPage;

  $scope.shareStory = function(url){
    ezfb.ui({
      method: 'share',
      href: url
      }, function(response){});
  };

  $scope.currentlyFollowing = Followers.following;

  $scope.getData = function() {
    Links.getTopStories();
  };
  
  $scope.addUser = function(username) {
    Followers.addFollower(username);
  };

  $scope.getData();
});

