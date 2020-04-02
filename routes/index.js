// ALL REQUIRED PLUGIN VARIABLES
const express = require('express');
const router = express.Router();
const Workout = require('../models/workout');

router.get('/', (req, res) => res.render('index.ejs'));

router.get('/search', (req, res) => {
    Workout.find({}, function(err, workouts){
        if(err){
            return res.json({
                "status": "failure",
                "msg": err.message
            });
        }
        else{
            console.log(workouts);
            return res.json({
                "status": "success",
                "workouts": workouts
            });
        }
    })
});

module.exports = router;
