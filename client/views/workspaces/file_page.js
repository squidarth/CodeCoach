Template.filePage.helpers({
  workspace: function() {
    file = Files.findOne({_id: Session.get('currentFile')});
    return Workspaces.findOne({_id: file.workspaceId});
  },
  files: function() {
    file = Files.findOne({_id: Session.get('currentFile')});
    workspace = Workspaces.findOne({_id: file.workspaceId});
    return Files.find({workspaceId: workspace._id});
  }
});

Template.filePage.events({
  'click #create-file-button' : function(event) {
    event.preventDefault();
    var fileName = $('#fileNameInput').val();

    var file = {
      userId: Meteor.userId(),
      workspaceId: Session.get('currentWorkspace'),
      name: fileName
    }

    file._id = Files.insert(file);
    $("#file-modal").modal('toggle'); 
    Router.go('/files/' + file._id);
  }
});

