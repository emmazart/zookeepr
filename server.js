const express = require('express');
const { animals } = require('./data/animals.json');
const PORT = process.env.PORT || 3001;
const fs = require('fs');
const path = require('path');

// instantiate the server
const app = express();

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming json data
app.use(express.json());


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

// takes in the id and array of animals and returns a single animal object
function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

// accepts POST route's req.body value and the array we want to add data to
function createNewAnimal(body, animalsArray) {
    console.log(body);
    // main function code
    const animal = body;
    animalsArray.push(animal);
    // write new animal to json file synchronously
    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        JSON.stringify({ animals: animalsArray }, null, 2)
    );
    // return finished code to post route for response
    return animal;
}








// GETTING DATA FROM API
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


app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    // if there is a result, return it
    if (result){
        res.json(result);
    // else send 404 error
    } else {
        res.send(404);
    }
});

// POSTING DATA TO API
app.post('/api/animals', (req, res) => {
    // req.body is where our incoming content will be
    req.body.id = animals.length.toString(); // give new animal an id based on what the next index of the array will be
    const animal = createNewAnimal(req.body, animals); // add animal to json file and animals array by passing thru function
    res.json(animal);
});

// chain listen method to server
app.listen(PORT, () => {
    console.log(`API server is now on port ${PORT}!`);
});