var MongoClient = require( "mongodb" ).MongoClient;

var _db;

module.exports = {

  connectToServer: function( callback ) {
    MongoClient.connect( "mongodb://dock:D2ckD2ck@103.227.177.152:27017/dock", { useNewUrlParser: true } , function( err, db ) {
      _db = db.db("dock");
      return callback( err );
    } );
  },

  getDb: function() {
    return _db;
  }
};