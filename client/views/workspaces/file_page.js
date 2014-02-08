Meteor.setInterval(function() {
  Meteor.call('getOutput', {}, function(error, response) {
    file = Files.findOne({_id: Session.get('currentFile')});

    if (response.data.output != "") {
      Files.update(Session.get('currentFile'), {$set: {lastResults: response.data.output}});
    }
  });

}, 1500);

Template.filePage.helpers({
  workspace: function() {
    file = Files.findOne({_id: Session.get('currentFile')});
    return Workspaces.findOne({_id: file.workspaceId});
  },
  files: function() {
    file = Files.findOne({_id: Session.get('currentFile')});
    workspace = Workspaces.findOne({_id: file.workspaceId});
    return Files.find({workspaceId: workspace._id});
  },
  code_samples: function() {
    return Hints.find({service: "ohloh", fileId: Session.get('currentFile')}, {sort: {'created_at' : -1}, limit: 5});
  },
  hints: function() {
    return Hints.find({service: "stackoverflow", fileId: Session.get('currentFile')}, {sort: {'created_at' : -1}, limit: 5});
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
  },
  'click #run-button' : function(event) {
    event.preventDefault();

    Meteor.call("runCode", Session.get('currentFile'), function(error, response) {
    });
  },
  'click #save-file-button' : function(event) {
    event.preventDefault();
    Files.update(Session.get('currentFile'), {$set: {code: codeMirror.doc.getValue() }});
    Meteor.call("runCode", Session.get('currentFile'), function(error, response) {
    });

    Meteor.call('getOhloh', Session.get('currentFile'), function(error, response) {
      var links = response.data.links;

      for (var i = 0; i <links.length;i++) {
        if (links[i].name) {
          Hints.insert({
            service: "ohloh",
            url: "http://code.ohloh.net" + links[i].url,
            name: links[i].name,
            fileId: Session.get('currentFile'),
            userId: Meteor.userId(),
            created_at: new Date()
          });
        }
      }
    });

    Meteor.call('getStackOverflow', Session.get('currentFile'), function(error, response) {
      var links = response.data.links;
      for (var i = 0; i<links.length;i++) {
        Hints.insert({
          service: "stackoverflow",
          url: "http://stackoverflow.com" + links[i].url,
          name: links[i].name,
          fileId: Session.get('currentFile'),
          userId: Meteor.userId(),
          created_at: new Date()
        });
      }
    });
  }
});

Template.filePage.renderCodeEditor = function() {
  Meteor.defer(function() {
    codeMirror = CodeMirror.fromTextArea($("#results-box")[0], {
      mode: "python",
      autofocus: true,
      theme: "blackboard",
      lineNumbers: true,
      readOnly: true,
      lineNumberFormatter: function(line) {
        return ">";
      }
    });

    codeMirror.setSize(null, 150);
  });

  Meteor.defer(function() {
    codeMirror = CodeMirror.fromTextArea($("#code-editor")[0], {
      mode: "python",
      autofocus: true,
      theme: "blackboard",
      lineNumbers: true
    });
  });
};
