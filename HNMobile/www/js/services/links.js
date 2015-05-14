angular.module('hack.linkService', [])

.factory('Links', function($http, $interval/*, Followers*/) {
  var personalStories = [];
  var topStories = [];
  var comments = [];

  var getTopStories = function() {
    var url = 'http://hnmobileapp.herokuapp.com/api/cache/topStories';

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

  var getComments = function(storyID) {
    var query = 'http://hn.algolia.com/api/v1/search?hitsPerPage=500&tags=comment,story_' + storyID;

    return $http({
      method: 'GET',
      url: query
    })
    .then(function(resp) {

      // var commentsTree = sortComments(resp.data.hits);
      // console.log(comments);
      // Very important to not point comments to a new array.
      // Instead, clear out the array, then push all the new
      // datum in place. There are pointers pointing to this array.
      comments.splice(0, comments.length);
      comments.push.apply(comments, resp.data.hits);
    });
  };

  var arrToCSV = function(arr){
    var holder = [];

    for(var i = 0; i < arr.length; i++){
      holder.push('author_' + arr[i]);
    }

    return holder.join(',');
  };

  var Tree = function(value) {
    this.value = value;
    this.children = [];
  };

  Tree.prototype.addChild = function(value) {
    this.children.push(new Tree(value));
  };

  var sortComments = function(commentsArray) {
    var count = 0;
    var commentTree = new Tree(commentsArray[0].story_id);

    console.log(commentsArray.length);

    commentsArray.forEach(function(item, i) {
      if (item.parent_id === commentTree.value) {
        commentTree.addChild(item);
        count++
      }
    });

    console.log(count);

    var subRoutine = function(node) {
      if (count === commentsArray.length) {
        return;
      }

      node.children.forEach(function(parent) {
        commentsArray.forEach(function(child, i) {

          if (child.parent_id === parseInt(parent.value.objectID)) {

              parent.addChild(child);
              count++;

          }
        });
      });

      if (node.children[0]) {
        node.children.forEach(function(childNode) {
          subRoutine(childNode)
        });
      }
    };

    subRoutine(commentTree);
    return commentTree;

    console.log(count);

  };

  var init = function(){
    // getPersonalStories(Followers.following);

    $interval(function(){
      // getPersonalStories(Followers.following);
      getTopStories();
    }, 300000);
  };

  init();

  return {
    getTopStories: getTopStories,
    getPersonalStories: getPersonalStories,
    getComments: getComments,
    personalStories: personalStories,
    topStories: topStories,
    comments: comments
  };
});

