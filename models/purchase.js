"use strict";

module.exports = function(sequelize, DataTypes) {
    var Purchase = sequelize.define("Purchase", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ListingId: DataTypes.INTEGER,
        UserId: DataTypes.INTEGER,
        PUserId: DataTypes.INTEGER,
        UserCC: DataTypes.INTEGER,
        UserAddress: DataTypes.STRING,
        ListingPrice: DataTypes.DECIMAL,
        ListingTitle: DataTypes.STRING,
        quantity: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function(models) {
                Purchase.belongsTo(models.User, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        allowNull: false
                    }
                });
            }
        }
    });

    return Purchase;
};
