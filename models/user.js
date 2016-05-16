/**
 * Created by cuan on 5/12/16.
 */

"use strict";

module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define("User", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: DataTypes.STRING,
        password: DataTypes.STRING
    }, {
        classMethods: {
            associate: function (models) {
                User.hasMany(models.Listing)
            }
        }
    });

    return User;
};
