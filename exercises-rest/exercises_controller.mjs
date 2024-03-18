import 'dotenv/config';
import * as exercises from './exercises_model.mjs';
import express from 'express';

const PORT = process.env.PORT;

const app = express();

app.use(express.json());

/**
 * Create a new exercise with the name, reps, weight, unit, and date provided in the body
 */
app.post('/exercises', (req, res) => {
    
    /*
    First, validate the request. We assume it is a JSON object however we validate the request body.

    The body must contain all 5 properties(inother words, if any of the 5 properties is missing
    the request is invalid)
    */
    if (!req.body.name || !req.body.reps ||
         !req.body.weight || !req.body.unit || !req.body.date
    ) {
        return res.status(400).json({ Error: 'Invalid request'})
    
    //name property must be a string containing at least one character(i.e. it cant be empty or a null string)
    } else if (
        typeof req.body.name !== 'string' || 
        req.body.name === ''
        ) {
        return res.status(400).json({Error: 'Invalid request'});

    //reps property must be an integer greater than 0
    } else if (Number.isInteger(req.body.resp) === false && req.body.reps <= 0) {
        return res.status(400).json({ Error: 'Invalid request'});

    //weight property must be an integer greater than 0
    } else if (Number.isInteger(req.body.weight) === false && req.body.weight <= 0) {
        return res.status(400).json({ Error: 'Invalid request' });

    //unit property must be either the string 'kgs' or the string 'lbs'
    } else if (typeof req.body.unit !== 'string' || (req.body.unit !== 'kgs' && req.body.unit !== 'lbs')) {
        return res.status(400).json({ Error: 'Invalid request' });
    
    //date property must be a string in the format 'MM-DD-YY' where MM, DD, adn YY are 2-digit integers
    } else if (isDateValid(req.body.date) !== true){
        return res.status(400).json({ Error: 'Invalid request' });

    } else {
    exercises.createExercise(req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date)
        .then(exercise => {
            res.status(201).json(exercise);
        })
        .catch(error => {
            console.error(error);
            // In case of an error, send back status code 400.
            // A better approach will be to examine the error and send an
            // error status code corresponding to the error.
            res.status(400).json({ Error: 'Request failed' })
        })
    }
});

/**
 * Retrive the exercise corresponding to the ID provided in the URL.
 */
app.get('/exercises/:_id', (req, res) => {
    const exerciseID = req.params._id;
    exercises.findExerciseById(exerciseID)
    .then(exercise => {
        if (exercise !== null) {
            res.status(200).json(exercise);
        } else {
            res.status(404).json({ Error: "Not found" })
        }
    })
    .catch(error => {
        console.error(error);
        res.status(400).json({ Error: 'Request failed'})
    })
});

/**
 * Retrieve  exercises. All exercises are returned.
 */
app.get('/exercises', (req, res) => {
    let filter = {};
    exercises.findExercises(filter, '', 0)
        .then(exercises => {
            res.status(200).json(exercises);
        })
        .catch(error => {
            console.error(error);
            res.status(400).json({ Error: 'Request failed' })
        });
});

/**
 * Update the exercise whose id is provided in the path parameter and set
 * its name, reps, weight, unit, and body to the values provided in the body.
 */
app.put('/exercises/:_id', (req, res) => {
    exercises.replaceExercise(req.params._id, req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date)
    .then(numUpdated => {
        if (numUpdated === 1) {
            res.status(200).json({ _id: req.params._id, name: req.body.name, reps: req.body.reps, weight: req.body.weight,
                 unit: req.body.unit, date: req.body.date})
        } else {
            res.status(404).json({ Error: "Not found" });
        }
    })
    .catch(error => {
        console.error(error);
        res.status(400).json({ Error: "Invalid request" })
    })
});

/**
 * Delete the exercise whose id is provided in the query parameters
 */
app.delete('/exercises/:_id', (req, res) => {
    exercises.deleteById(req.params._id)
    .then(deletedCount => {
        if (deletedCount === 1) {
            res.status(204).send();
        } else {
            res.status(404).json({ Error: "Not found"})
        }
    })
    .catch(error => {
        console.error(error);
        res.send({ error: 'Request failed' });
    });
});

/**
*
* @param {string} date
* Return true if the date format is MM-DD-YY where MM, DD and YY are 2 digit integers
*/
function isDateValid(date) {
    // Test using a regular expression. 
    const format = /^\d\d-\d\d-\d\d$/;
    return format.test(date);
}

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});