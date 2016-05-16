/**
 * Created by cuan on 5/12/16.
 */

"use strict";

module.exports = function(sequelize, DataTypes) {
    var Listing = sequelize.define("Listing", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        category: DataTypes.STRING,
        title: DataTypes.STRING,
        price: DataTypes.DECIMAL,
        description: DataTypes.STRING,
        date_purchased: DataTypes.DATE
    }, {
        classMethods: {
            associate: function(models) {
                Listing.belongsTo(models.User, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        allowNull: false
                    }
                });
                Listing.hasMany(models.Picture);
            }
        }
    });

    return Listing;
};
