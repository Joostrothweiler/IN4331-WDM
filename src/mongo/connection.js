// https://www.packtpub.com/books/content/mongo-goes-to-the-movies
// https://mongodb.github.io/node-mongodb-native/markdown-docs/queries.html
// http://mongodb.github.io/node-mongodb-native/2.2/tutorials/projections/

var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/imdb';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    db.close();
});

// Mixing AND and OR statements:
// {
//     title:"MongoDB",
//         $or:[
//     {author:"Daniel"},
//     {author:"Jessica"}
// ]
// }

// Import data using the command line:
// >> cd "C:\Program Files\MongoDB\Server\3.4\bin"
// >> mongoimport --host localhost:27017 --db imdb --collection movies < "C:\Users\Roos\Projects\IN4331-WDM\data\mongo\data\movies.json"
// >> mongoimport --host localhost:27017 --db imdb --collection actors < "C:\Users\Roos\Projects\IN4331-WDM\data\mongo\data\actors.json"
// >> mongoimport --host localhost:27017 --db imdb --collection plot < "C:\Users\Roos\Projects\IN4331-WDM\data\mongo\data\plot.json"
// >> mongoimport --host localhost:27017 --db imdb --collection genres < "C:\Users\Roos\Projects\IN4331-WDM\data\mongo\data\genres.json"
// >> cd "C:\Users\Roos\Projects\IN4331-WDM\src\mongo"