var models  = require('../models');
var express = require('express');
var router  = express.Router();

router.get('/', function(req, res) {
    var loggedIn;
    if (req.session_state.username) {
        loggedIn = req.session_state.username;
    }
    models.Listing.findAll({
        include: [ models.Picture ]
    }).then(function(listings) {
        if(listings == null){        // test if the results is null
            res.status(404);    //Set the HTTP error code
            console.log("Not Found \n");
        }

		  res.set('Cache-Control', 'max-age='+(8/*hrs*/*60/*min*/*60/*s*/)+', public');
		  res.set('Vary', 'Cookie');
        res.render('listing', {
            title: 'Express',
            listings: listings,
            loggedIn: loggedIn
        }).catch(function(err){
            console.log("Listings router 1: ", err.body)
        });
    }).catch(function (err) {
        res.status(404);    //Set the HTTP error code
        console.log("Not Found " + err.message);
    });
});

router.get('/:listing_id/view/', function(req, res) {
    var loggedIn;
    if (req.session_state.username) {
        loggedIn = req.session_state.username;
    }
    models.Listing.findAll({
        where:{
            id: req.params.listing_id
        },
        include: [ models.Picture ]
    }).then(function(listings) {
        if(listings == null){        // test if the results is null
            res.status(404);    //Set the HTTP error code
            console.log("Not Found \n");
        }

		  res.set('Cache-Control', 'max-age'+(16/*hrs*/*60/*min*/*60)+', public');
		  res.set('Vary', 'Cookie');
        res.render('listing', {
            title: 'Express',
            listings: listings,
            loggedIn: loggedIn
        });
    }).catch(function (err) {
        res.status(400);    //Set the HTTP error code
        console.log("Bad Request " + err.message);
    });
});


module.exports = router;