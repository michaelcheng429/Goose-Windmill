angular.module('hack.search', [])
  .controller('SearchController', function ($scope,Links){
    $scope.stories = Links.topStories;
    $scope.getData = function() {
      Links.getTopStories();
    };
    $scope.getData();
  });
