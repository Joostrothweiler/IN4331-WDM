var findMoviesOnId = function(db, id, kind, year, callback) {
    // Get the movies collection
    var movies = db.collection('movies');

    // Find movie on id ($regex allows partial search)
    movies.find({"id": {"$regex": id}, "kind": kind, "year": year}, {"_id": 0, "kind": 0}).toArray(function(err, movs) {
        assert.equal(err, null);
        console.log("Found the following movies:");
        console.log(movs);
        callback(movs);
    });
};

var findMoviesOnTitle = function(db, title, kind, year, callback) {
    // Get the movies collection
    var movies = db.collection('movies');

    // Find movie on title ($regex allows partial search)
    movies.find({"title": {"$regex": title}, "kind": kind, "year": year}, {"_id": 0, "kind": 0}).toArray(function(err, movs) {
        assert.equal(err, null);
        console.log("Found the following movies:");
        console.log(movs);
        callback(movs);
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

    var id = "Star Wars";
    var title = "Star Wars";
    var kind = "movie";
    var year = [ 2016 ];

    // Allows for partial search
    var regexSearchOptions = {
        "title": {
            "$regex": title
        }
    };

    findMoviesOnTitle(db, title, kind, year, function () {
        db.close();
    })

    findMoviesOnId(db, id, kind, year, function () {
        db.close();
    })
});
