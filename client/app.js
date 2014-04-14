Router.configure({
  layoutTemplate: 'layout'
});

Router.map(function() {
  this.route('home', {
    path: '/',    
    action: function() {
      if (Meteor.user()) {
        this.render('workspacesList');
      } else {
        this.render('home');
      }
    }
  });

  this.route('workspace', {
    path: '/workspace/:_id',
    waitOn: function() {
      return [this.subscribe('workspaces'), this.subscribe('files')];
    },
    before: [
      function() {
        if (this.ready() ) {
        } else {
          this.render('loading'); 
          this.stop();
        }
      }
    ],
    action: function(id) {
      var id = this.params._id;
      file = Files.findOne({workspaceId: id});
      this.redirect('/files/' + file._id);
    }
  });

  this.route('file', {
    path: '/files/:_id',
    template: 'filePage',
    before: [
      function() {
        this.subscribe('files').wait();
      },
      function() {
        if (this.ready()) {
        }else {
          this.stop();
        }
      }
    ],
    data: function() {
      return Files.findOne({_id: this.params._id});
    },
    after: [
      function() {
        file = Files.findOne({_id: this.params._id});
        Session.set('currentWorkspace', file.workspaceId);
        Session.set('currentFile', this.params._id);
      }
    ]
  });
});
