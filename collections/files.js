Files = new Meteor.Collection('files');
Domain =  "http://ec2-184-72-141-86.compute-1.amazonaws.com:4000"
if (Meteor.isServer) {
  Meteor.methods({
    getOhloh: function(fileId) {
      file = Files.findOne({_id: fileId});
      
      result = Meteor.http.post(Domain + "/ohloh", 
        {params: {contents: file.code}});
      
      return result; 
    },
    getStackOverflow: function(fileId) {
      file = Files.findOne({_id: fileId});

      result = Meteor.http.post(Domain + "/stackoverflow",
        {params: {contents: file.code}});

      return result;
    },
    runCode: function(fileId) {
      file = Files.findOne({_id: fileId});

      result = Meteor.http.post(Domain+ "/command",
        {params: {contents: file.code}});

      return result;
    },

    getOutput: function(fileId) {
      return Meteor.http.get(Domain + "/getoutput");
    }
  });
}
