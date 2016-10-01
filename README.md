# mongo-cursor-reducer
Iterate over each document of a Mongo Query sequentially

### Usage

```
var mongodb = require('mongodb');
var reduce = require('mongo-cursor-reducer');
var connectedP = mongodb.MongoClient.connect(mongo_url);

var usersCursorP = connectedP.then(function(db) {
  return db.collection('users').find();
});

var countP = usersCursorP.then(function(cursor) {
  return reduce(cursor, function(count, user) {
    var fullName = user.firstName + ' ' + user.lastName;
    var newUserP = db.collection('users').findAndModify({ _id: user._id }, {
      $set: { fullName: fullName }
    });
    return newUserP.then(function() {
      return count + 1;
    });
  }, 0);
});

countP.then(function(count) {
  console.log('Successfully iterated over ' + count + ' users in total');
  process.exit(0);
})
.catch(function(error) {
  console.log('Fail to process one user', error);
  process.exit(1);
});
```
