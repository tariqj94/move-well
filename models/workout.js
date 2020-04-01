var mongoose = require('mongoose');

// SCHEMA SETUP
var workoutSchema = new mongoose.Schema({
    isUnlisted: {type: Boolean, default: false},
    name: String,
    description: String,
    intensity: String,
    url: String,
    owner: String
});

module.exports = mongoose.model('Workout', workoutSchema);