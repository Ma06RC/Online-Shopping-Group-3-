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
        res.render('listing', {
            title: 'Express',
            listings: listings,
            loggedIn: loggedIn
        });
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
        res.render('listing', {
            title: 'Express',
            listings: listings,
            loggedIn: loggedIn
        });
    });
});


module.exports = router;