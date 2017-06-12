// https://www.packtpub.com/books/content/mongo-goes-to-the-movies
// http://mongodb.github.io/node-mongodb-native/2.2/tutorials/projections/

var findMovies = function(db, title, kind, year, callback) {
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

    var title = "Star Wars";
    var kind = "movie";
    var year = [ 2016 ];

    // Allows for partial search
    var regexSearchOptions = {
        "title": {
            "$regex": title
        }
    };

    findMovies(db, title, kind, year, function () {
        db.close();
    })

    // insertDocuments(db, function() {
    //     indexCollection(db, function() {
    //         db.close();
    //     });
    // });
});

// Import data using the command line:
// >> cd "C:\Program Files\MongoDB\Server\3.4\bin"
// >> mongoimport --host localhost:27017 --db imdb --collection movies < "C:\Users\Roos\Projects\IN4331-WDM\data\mongo\data\movies.json"
// >> mongoimport --host localhost:27017 --db imdb --collection actors < "C:\Users\Roos\Projects\IN4331-WDM\data\mongo\data\actors.json"
// >> mongoimport --host localhost:27017 --db imdb --collection plot < "C:\Users\Roos\Projects\IN4331-WDM\data\mongo\data\plot.json"
// >> mongoimport --host localhost:27017 --db imdb --collection genres < "C:\Users\Roos\Projects\IN4331-WDM\data\mongo\data\genres.json"
// >> cd "C:\Users\Roos\Projects\IN4331-WDM\src\mongo"