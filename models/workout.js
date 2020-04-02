var mongoose = require('mongoose');

// SCHEMA SETUP
var workoutSchema = new mongoose.Schema({
    isUnlisted: {type: Boolean, default: false},
    genre: String,
    duration: Number,
    difficulty: String,
    gear: Array,
    url: String
});

module.exports = mongoose.model('Workout', workoutSchema);