Meteor.publish('workspaces', function() {
  return Workspaces.find();
});
