var MongoClient = require( "mongodb" ).MongoClient;
var _db;

module.exports = {
  connectToServer: ( resolve, reject ) => {
    MongoClient.connect( "mongodb+srv://dock:D2ckD2ck@users-9ynpf.mongodb.net/test?retryWrites=true", { useNewUrlParser: true } , function( err, db ) {
      if(err === null) {
        resolve("connected to Users DB");
        _db = db.db("users");
      }
      reject(err);
    } );
  },
  getDb: function() {
    return _db;
  }
};