
describe("CurrentlyFollowingController", function() {
   beforeEach(module('hack'));

   var $controller;

   beforeEach(inject(function(_$controller_){
    $controller = _$controller_;
   }));

   afterEach(function() { });

   describe('$scope.follow', function () {
    it('sets $scope.newFollow to empty string', function() {
      var $scope = {};
      var controller = $controller('CurrentlyFollowingController', {$scope: $scope});
      $scope.follow("x");
      expect($scope.newFollow).to.equal("");
    });
   });
});