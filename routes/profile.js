var models = require('../models');
var express = require('express');
var router = express.Router();


router.get('/cart/destroy/:cart_id/', function (req, res) {

    models.Cart.destroy({
        where: {
            id: req.params.cart_id
        }
    }).then(function () {
        res.redirect(req.get('referer'));
    });
});




router.get('/*', function (req, res) {
    var loggedIn;
    var cartReturn;
    var wishlistReturn;
    var purchaselistReturn;
    var userID;
    if (!req.session_state.username) {
        res.render('login',
            {
                title: 'iShopShop',
                message: "please login to view your profile"
            });
    }
    else {
        loggedIn = req.session_state.username;
        UserID = req.session_state.userID;

        models.Cart.findAll({
                where: {
                    UserId: UserID
                }
            })
            .then(function (listings) {
                cartReturn = listings;

                        models.Purchase.findAll({
                                where: {
                                    UserId: UserID
                                }
                            })
                            .then(function(purchaselist){
                                purchaselistReturn = purchaselist;
                                res.render('profile', {
                                    title: 'title',
                                    UserID: UserID,
                                    listings: cartReturn,
                                    //wishlist: wishlistReturn,
                                    purchaselist: purchaselistReturn,
                                    loggedIn: loggedIn
                                });

                            });

                    });



    }
});

router.get('/buycart/:cart_id/', function (req, res) {

    models.Cart.findAll({
        where: {
            id: req.params.cart_id
        }
    }).then(function (results) {

        console.log("buycart ", results[0]);

        for(i = 0; i < results.length; i++){
                models.Purchase.create({
                UserId: req.session_state.userID,
                PUserId: req.session_state.userID,
                ListingId: req.body.ListingId,
                UserCC: 123445,
                UserAddress: "place holder address",
                ListingTitle: req.body.ListingTitle,
                ListingPrice: req.body.ListingPrice,
                quantity: req.body.quantity
            })
        }
        res.redirect(req.get('referer'));
    });
});

/*
 router.get('/!*', function (req, res) {
 var loggedIn;
 var cartReturn;
 var wishlistReturn;
 var purchaselistReturn;
 var userID;
 if (!req.session_state.username) {
 res.render('login',
 {
 title: 'iShopShop',
 message: "please login to view your profile"
 });
 }
 else {
 loggedIn = req.session_state.username;
 UserID = req.session_state.userID;
 console.log("UserID: "+ req.session_state.userID);

 models.Cart.findAll({
 where: {
 UserId: UserID
 }
 })
 .then(function (listings) {
 cartReturn = listings;
 models.Wishlist.findAll({
 where: {
 UserId: UserID
 }
 })
 .then(function (wishlist) {
 wishlistReturn = wishlist;
 models.Purchase.findAll({
 where: {
 UserId: UserID
 }
 })
 .then(function(purchaselist){
 purchaselistReturn = purchaselist;
 res.render('profile', {
 title: 'iShopShop',
 UserID: UserID,
 listings: cartReturn,
 wishlist: wishlistReturn,
 purchaselist: purchaselistReturn,
 loggedIn: loggedIn
 });

 });

 });


 });
 }
 });
 */


module.exports = router;
