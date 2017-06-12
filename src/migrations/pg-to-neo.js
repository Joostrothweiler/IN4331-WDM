const request = require('request');
const rp = require('request-promise');
const { BASE_URL } = require('../config');

const migrateModels = (type) => {

  let neoUrl = BASE_URL + '/neo/' + type;
  let pgUrl = BASE_URL + '/pg/' + type + '?page=0&perPage=100'; // TODO: Make function paginated

  rp.del({ uri: neoUrl, json: true})
    .then(function(response) {

      console.log('Succesfully removed existing models.');

      rp.get({ uri: pgUrl, json: true})
        .then(function(response) {
            const saveNeo = (key) => {
                if (key < response.length) {
                    new Promise((resolve) => {

                        let model = response[key];

                        request.post({url: neoUrl, form: model }, function(error, response, body) {
                          if(!error && response.statusCode == 200) {
                            resolve('success' + key);
                          }
                          else {
                            console.log(model);
                            console.log('Something went wrong inserting model.');
                          }
                        });
                    }).then(res => {
                        console.log(res)
                        saveNeo(key + 1)
                    })
                }
            }
            console.log(response.length);
            response.length > 0 && saveNeo(0);
        });
    });
}

migrateModels('movies');
migrateModels('actors');
// migrateModels('genres'); // TODO: Implement

// TODO: Link models together through migration.
