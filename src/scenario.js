function stats(actor) {
  let { fname, mname, lname, movies: { length: movies_count } } = actor;
  let name = [ fname, mname, lname ].filter(x => x).join(' ');

  return {
    name,
    movies_count
  };
}

function explore(genre) {
  let { movies } = genre;
  console.log(movies);
  return { movies };
}

const scenarios = {
  'stats': stats,
  'explore': explore
};

function _getProcessor(scenario) {
  if (!(scenario in scenarios)) throw new Error(`'${scenario}' is not a valid scenario.`);
  return scenarios[scenario];
}

function checkScenario(scenario) {
  return (scenario in scenarios);
}

function processScenario(scenario) {
  if (!scenario) return x => x;
  let processor = _getProcessor(scenario);
  return (data) => [].concat(data).map(processor);
}

module.exports = {
  checkScenario,
  processScenario,
}
