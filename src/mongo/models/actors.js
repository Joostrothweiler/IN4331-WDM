var findActorsOnId = function(db, id, callback) {
    // Get the movies collection
    var actors = db.collection('actors');

    // Find actor on id ($regex allows partial search)
    actors.find({"id": {"$regex": id}}, {"_id": 0}).toArray(function(err, acts) {
        assert.equal(err, null);

        console.log("Found the following actors:");
        console.log(acts);
        callback(acts);
    });
};

var findActorsOnName = function(db, name, kind, year, callback) {
    // Get the movies collection
    var actors = db.collection('actors');

    // Find actor on name ($regex allows partial search)
    actors.find({"name": {"$regex": name}}, {"_id": 0}).toArray(function(err, acts) {
        assert.equal(err, null);
        console.log("Found the following actors:");
        console.log(acts);
        callback(acts);
    });
};

var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/imdb';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    var id = "Hanks";
    var name = "Hanks";
    var kind = "movie";
    var year = [ 2016 ];

    // Allows for partial search
    var regexSearchOptions = {
        "id": {
            "$regex": id
        }
    };

    // findActorsOnName(db, name, function () {
    //     db.close();
    // })

    findActorsOnId(db, id, function () {
        db.close();
    })
});
