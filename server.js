const express = require('express');
const { animals } = require('./data/animals.json');

// instantiate the server
const app = express();


function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    // we save the animalsArray as filtered results here:
    let filteredResults = animalsArray;

    // handling personality traits queries
    if (query.personalityTraits) {
        // if personalityTraits is a string, place it into a new array
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        }
        // else save personalityTraits as a dedicated array
        else {
            personalityTraitsArray = query.personalityTraits
        }
        // loop through each trait in array
        personalityTraitsArray.forEach(trait => {
            // Check the trait against each animal in the filteredResults array.
            // Remember, it is initially a copy of the animalsArray,
            // but here we're updating it for each trait in the .forEach() loop.
            // For each trait being targeted by the filter, the filteredResults
            // array will then contain only the entries that contain the trait,
            // so at the end we'll have an array of animals that have every one 
            // of the traits when the .forEach() loop is finished.
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }

    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }

    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }

    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name)
    }

    return filteredResults;
}













// get method takes 2 arguments: string describing fetch route & callback func
app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    // send method from res parameter
    // res.send('Hello!');
    res.json(results);
});

// chain listen method to server
app.listen(3001, () => {
    console.log(`API server is now on port 3001!`);
});