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

router.get('/wish/destroy/:wish_id/', function (req, res) {

    models.Wishlist.destroy({
        where: {
            id: req.params.wish_id
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



module.exports = router;
