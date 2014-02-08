Meteor.publish('workspaces', function() {
  return Workspaces.find({userId: this.userId});
});

Meteor.publish('files', function() {
  return Files.find({userId: this.userId});
});

Meteor.publish('hints', function() {
  return Hints.find({userId: this.userId});
});
