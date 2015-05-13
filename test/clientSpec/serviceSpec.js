describe('followService tests', function() {

  beforeEach(module('hack'));

  beforeEach(inject(function(_Followers_) {
    Followers = _Followers_;
  }));

  describe('followService methods', function() {
    it ('should have a removeFollower method', function () {
      expect(Followers.removeFollower).to.be.a('function');
    });
    it ('should have an addFollower method', function () {
      expect(Followers.addFollower).to.be.a('function');
    });
    it ('should have an localToArr method', function () {
      expect(Followers.localToArr).to.be.a('function');
    });
  });

  describe('addFollower method', function () {
    beforeEach(function() {
      $window.localStorage.setItem('hfUsers', 'user1,user2');
      Followers.init();
    });
    afterEach(function() {
      $window.localStorage.removeItem('hfUsers');
    });
    it ('should add a follower to local storage', function () {
      Followers.addFollower('pinky');
      expect($window.localStorage.getItem('hfUsers')).to.equal('user1,user2,pinky');
    });
  });

  describe('removeFollower method', function () {
    beforeEach(function() {
      $window.localStorage.setItem('hfUsers', 'user1,pinky,user2');
      Followers.init();
    });
    afterEach(function() {
      $window.localStorage.removeItem('hfUsers');
    });
    it ('should remove a follower from local storage', function () {
      Followers.removeFollower('pinky');
      expect($window.localStorage.getItem('hfUsers')).to.equal('user1,user2');
    });
  });
});