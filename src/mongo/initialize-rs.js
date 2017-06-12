
const MongoClient = require('mongodb').MongoClient
const Server = require('mongodb').Server;

const client = new MongoClient(new Server('mongo'))

client.open((err, client) => {
    console.log(client.rs.status());
})

