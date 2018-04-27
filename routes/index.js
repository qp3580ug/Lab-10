var express = require('express');
var router = express.Router();
var bird = require('../models/bird');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/addBird', function(req, res, next){

  var bird = Bird(req.body);

  bird.nest = {
    location: req.body.nestLocation,
    materials: req.body.nestMaterials
  };

  bird.save().then( (birdDoc) => {
    console.log(birdDoc);
    res.redirect('/');
  }).catch((err) => {

    if (err.name == 'ValidationError') {
      req.flash('error', err.message);
      res.redirect('/');
    }

    else {
      next(err);
    }

  });
});

router.get('/', function(req, res, next) {
  bird.find().select( {name: 1} ).sort( {name: 1} )
    .then( (birdDoc) => {
      console.log('All birds', birdDoc);
      res.render('index', {title: 'All Birds', birds: birdDoc} )
    }).catch( (err) => {
      next(err);
    })
});

router.get('/bird/:_id', function(req, res, next){
  bird.findOne( { _id: req.params._id} )
    .then( (birdDoc) => {
      if (birdDoc) {
        console.log(birdDoc);   res.render('birdinfo', { title: birdDoc.name, bird: birdDoc } );
      } else {
        var err = Error('Bird not found');
        err.status = 404;
        throw err;
      }
    })
    .catch( (err) => {
      next(err);
    });
});

router.post('/addSighting', function(req, res, next){
  bird.findOneAndUpdate(
    { _id: req.body._id},
    { $push: { dateSeen: { $each: [req.body.date], $sort: -1 } } },
    { runValidators: true } )

    .then( (updateBirdDoc ) => {
      if (updatedBirdDoc) {
        res.redirect('/bird/${req.body._id}');
      } else {
        var err = Error("Adding sighting error, bird not found");
        err.status = 404;
        throw err;
      }
    })
    .catch( (err) => {

      if (err.name === 'CastError') {
        req.flash('error', 'Date must be in a valid format');
        res.redirect('/bird/${req.body._id}');
      }
      else if (err.name === 'ValidationError') {
        req.flash('error', err.message);
        res.redirect('/bird/${req.body._id}');
      }
      else {
        next(err);
      }
    });
});

router.post('/delete', function(req, res, next){

  Task.findByIdAndRemove(req.body._id)
    .then( (deletedTask) => {
      if (deletedTask) {
        req.flash('info', 'Bird Sighting Deleted.')
        res.redirect('/');
      } else {
        var error = new Error('Bird Sighting Not Found')
        error.status = 404;
        next(err);
      }
    })
    .catch( (err) => {
      next(err);
    })
});

module.exports = router;
