var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

const url = "mongodb://mongo1/"
MongoClient.connect(url)
    .then((db) => {
        console.log('successfully connected')
        const initReplSet = () => {
            db.command({
                replSetInitiate: {
                    _id: 'mongo-replication',
                    members: [
                        { _id: 0, host: 'mongo1'},
                        { _id: 1, host: 'mongo2'},
                        { _id: 2, host: 'mongo3'},
                    ]
                }
            }).then(res => {
                console.log('Successfully initialized the replication set.')
                db.close()

            }).catch(err => {
                console.log('Something went wrong:')
                console.log(err)
                db.close()
            })
        }
        db.command({'replSetGetStatus': 1})
            .then(res => {
                console.log('ReplicaSet already initiated')
                console.log('Closing connection now...')
                db.close()
            }).catch(err => {
                console.log('ReplicaSet not yet initiated, doing it now')
                initReplSet()

        })

    }).catch((err) => {
        console.log('error?')
})

