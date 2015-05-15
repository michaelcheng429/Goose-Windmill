angular.module('hack.search', [])
  .controller('SearchController', function ($scope,Links){
    $scope.getData = function() {
      Links.getTopStories();
    };
    $scope.getData();

    $scope.stories = Links.topStories;

    $scope.storiesMostPoints = $scope.stories.slice().sort(function(a,b) {
      return b.points - a.points;
    });

    $scope.storiesMostRecent = $scope.stories.slice().sort(function(a,b) {
      return new Date(b.created_at) - new Date(a.created_at);
    });
  });
