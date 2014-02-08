Files = new Meteor.Collection('files');

if (Meteor.isServer) {
  Meteor.methods({
    getOhloh: function(fileId) {
      file = Files.findOne({_id: fileId});
      
      result = Meteor.http.post("http://localhost:4000/ohloh", 
        {params: {contents: file.code}});
      
      return result; 
    },
    getStackOverflow: function(fileId) {
      file = Files.findOne({_id: fileId});

      result = Meteor.http.post("http://localhost:4000/stackoverflow",
        {params: {contents: file.code}});

      return result;
    },
    runCode: function(fileId) {
      file = Files.findOne({_id: fileId});

      result = Meteor.http.post("http://localhost:4000/command",
        {params: {contents: file.code}});

      return result;
    },

    getOutput: function(fileId) {
      return Meteor.http.get("http://localhost:4000/getoutput");
    }
  });
}
