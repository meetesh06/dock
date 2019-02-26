var MongoClient = require( "mongodb" ).MongoClient;
var _db;

module.exports = {
  connectToServer: ( resolve, reject ) => {
    MongoClient.connect( "mongodb+srv://dock:D2ckD2ck@notifications-wehse.mongodb.net/test?retryWrites=true", { useNewUrlParser: true } , function( err, db ) {
      if(err === null) {
        resolve("connected to Notifications DB");
        _db = db.db("notifications");
      }
      reject(err);
    } );
  },
  getDb: function() {
    return _db;
  }
};