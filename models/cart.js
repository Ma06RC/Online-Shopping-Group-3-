"use strict";

module.exports = function(sequelize, DataTypes) {
    var Cart = sequelize.define("Cart", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ListingId: DataTypes.INTEGER,
        ListingPrice: DataTypes.DECIMAL,
        ListingTitle: DataTypes.STRING,
        quantity: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function(models) {
                Cart.belongsTo(models.User, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        allowNull: false
                    }
                });
            }
        }
    });

    return Cart;
};
