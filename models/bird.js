var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var birdSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Bird name is required.'],
    unique: true,
    uniqueCaseInsensitive: true,
    validate: {
      validator: function(n) {
        return n.length >= 2;
      },
      message: '{VALUE} is not valid, bird name must be at least 2 letters'
    }
  },
  
  description: String,

  averageEggs: {
    type: Number,
    min: [1, 'Should be at least 1 egg.'],
    max: [50, 'Should not be more than 50 eggs.'] },

  endangered: { type: Boolean, default: false },

  datesSeen: [
    {
      type: Date,
      required: [true, 'A date is required to add a new sighting.'],
      validate: {
        validator: function(date) {
          return date.getTime() <= Date.now();
        },
        message: 'Date must be a valid date, and date must be now or in the past.'
      },
    }
  ],

  height: {
    type: Number,
    min: [1, 'Should be at least 1cm.'],
    max: [300, 'Should not be more than 300cm.'],
  },

  nest: {
    location: String,
    materials: String
  }

});

var Bird = mongoose.model('Bird', birdSchema);
birdSchema.plugin(uniqueValidator);

module.exports = Bird;
