describe('homepage', function() {
  var EC = protractor.ExpectedConditions;

  beforeEach(function() {
    browser.get('http://localhost:3000');
  });

  it('should load the page', function() {
    expect(element(by.css('.feed')).isPresent()).toBe(true);
  });

  describe('following tab', function() {

    var input = element(by.model('newFollow'));
    var button = element(by.buttonText('Follow'));

    it('should add a typed-in user to follow', function() {
      input.sendKeys('pg');
      button.click();

      expect(element(by.repeater('user in currentlyFollowing').row(0)).isPresent()).toBe(true);
      expect(element(by.css('.followed-user')).getText()).toEqual('pg x');
    });

    it('should remove a followed user when clicked', function() {

      var x = $('.followed-user span');
      x.click();

      expect(element(by.repeater('user in currentlyFollowing').row(0)).isPresent()).toBe(false);
    });

    it('should add a user to follow when their Follow button in topStories is clicked', function() {

      var topStory = element(by.repeater('story in stories').row(0));
      var folButton = topStory.element(by.css('.bottom-row button'));
      var user;
      topStory.element(by.css('.bottom-row a.ng-binding')).getText().then(function (text) {
        folButton.click();
        user = text;
        expect(element(by.css('.followed-user')).getText()).toEqual(user + ' x');
      });

    });

  });
});