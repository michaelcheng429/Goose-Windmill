angular.module('hack.currentlyFollowing', [])

.controller('CurrentlyFollowingController', function ($scope, Followers) {
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
});
