Template.postsList.helpers({
  posts: function() {
    return Workspaces.find();
  }
});
