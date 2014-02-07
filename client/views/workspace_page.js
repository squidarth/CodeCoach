Template.postWorkspace.helpers({
  currentWorkspace: function() {
    return Workspaces.findOne(Session.get('currentPostId'));
  }
});
