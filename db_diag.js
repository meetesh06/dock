var MongoClient = require( "mongodb" ).MongoClient;
var _db;

module.exports = {
  connectToServer: ( resolve, reject ) => {
    MongoClient.connect( "mongodb+srv://dock:D2ckD2ck@diagnostics-onkqy.mongodb.net/test?retryWrites=true", { useNewUrlParser: true } , function( err, db ) {
      if(err === null) {
        resolve("connected to Diagnostics DB");
        _db = db.db("diagnostics");
      }
      reject(err);
    } );
  },
  getDb: function() {
    return _db;
  }
};