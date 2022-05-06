'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Client = sequelize.define('Client', {
        walletAddress: {
            type: DataTypes.STRING,
            defaultValue: ""
        },
        sessionToken:{
            type: DataTypes.STRING,
            defaultValue: ""
        },
        expiryTime:{
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue:DataTypes.NOW
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue:DataTypes.NOW
        }
    }, {});
    Client.associate = function(models) {
        // associations can be defined here

    };
    return Client;
};
