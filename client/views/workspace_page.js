Template.filePage.helpers({
  currentWorkspace: function() {
    return Workspaces.findOne(Session.get('currentWorkspaceId'));
  }
});
