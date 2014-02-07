Meteor.Router.add({
  '/' : {as: "home", to: function() {
    if (Meteor.user()) {
      return 'workspacesList'
    } else {
      return 'home'
    }
   }} ,

  '/about' : 'about',

  '/workspaces/:_id' : {
    to: "workspacePage",
    and: function(id) { Session.set('currentWorkspaceId', id);}
  }
});
