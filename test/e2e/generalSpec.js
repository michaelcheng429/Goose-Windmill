describe('homepage', function() {
  var ptor;

  beforeEach(function() {
    browser.get('http://localhost:3000');
  });

  it('should load the page', function() {
    expect(element(by.css('.feed')).isPresent()).toBeTruthy;
  });
});