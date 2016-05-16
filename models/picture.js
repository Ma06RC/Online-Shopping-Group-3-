/**
 * Created by cuan on 5/12/16.
 */

"use strict";

module.exports = function(sequelize, DataTypes) {
    var Picture = sequelize.define("Picture", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                Picture.belongsTo(models.Listing, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        allowNull: false
                    }
                });
            }
        }
    });

    return Picture;
};
