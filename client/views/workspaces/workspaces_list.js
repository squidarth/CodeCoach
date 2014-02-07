Template.workspacesList.helpers({
  workspaces: function() {
    return Workspaces.find();
  }
});

Template.workspacesList.events({
  'submit form' : function(event) {
    event.preventDefault();

    var workspace = {
      userId: Meteor.userId(), 
      name: $(event.target).find('[name=name]').val()
    }

    workspace._id = Workspaces.insert(workspace);

    var file = {
      userId: Meteor.userId(),
      workspaceId: workspace._id,
      name: $(event.target).find('[name=firstFileName]').val()
    };

    file._id = Files.insert(file);
  }
});
