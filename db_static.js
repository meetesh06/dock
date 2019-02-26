var MongoClient = require( "mongodb" ).MongoClient;
var _db;

module.exports = {
  connectToServer: ( resolve, reject ) => {
    MongoClient.connect( "mongodb+srv://dock:D2ckD2ck@static-bza3h.mongodb.net/test?retryWrites=true", { useNewUrlParser: true } , function( err, db ) {
      if(err === null) {
        resolve("connected to Static DB");
        _db = db.db("static");
      }
      reject(err);
    } );
  },
  getDb: function() {
    return _db;
  }
};