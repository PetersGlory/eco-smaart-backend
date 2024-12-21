const { Sequelize } = require('sequelize');
const config = require('../libs/DB-Client');

const sequelize = new Sequelize(config.development);

const User = require('./user')(sequelize, Sequelize.DataTypes);
const Otp = require('./otp')(sequelize, Sequelize.DataTypes);
const Transaction = require('./transaction')(sequelize, Sequelize.DataTypes);
const Notification = require('./notification')(sequelize, Sequelize.DataTypes);
const Issues = require('./issues')(sequelize, Sequelize.DataTypes);
const Campaign = require('./campaign')(sequelize, Sequelize.DataTypes);
const Tips = require('./tips')(sequelize, Sequelize.DataTypes);

module.exports = {
  sequelize,
  User,
  Otp,
  Transaction,
  Notification,
  Issues,
  Campaign,
  Tips
};