var P = require('bluebird-promisell');

// MongoDBQueryCursor -> Promise MongoDoc
var next = function(cursor) {
  return cursor.next();
};

// MongoDBQueryCursor -> (a -> MongoDoc -> Promise a) -> a -> Promise a
var reduce = function(cursor, reducer, accum) {
  var docP = next(cursor);
  return docP.then(function(doc) {
    if (!doc) {
      return P.purep(accum);
    } else {
      var nextAccumP = reducer(accum, doc);
      return P.liftp1(function(nextAccm) {
        return var reduce(cursor, reducer, nextAccm);
      })(nextAccumP);
    }
  });
};

module.exports = reduce;
