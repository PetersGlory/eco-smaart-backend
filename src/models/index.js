const { Sequelize } = require('sequelize');
const config = require('../libs/DB-Client');

const sequelize = new Sequelize(config.development);

const User = require('./user')(sequelize, Sequelize.DataTypes);
const Otp = require('./otp')(sequelize, Sequelize.DataTypes);
const Transaction = require('./transaction')(sequelize, Sequelize.DataTypes);
const Notification = require('./notification')(sequelize, Sequelize.DataTypes);
const Issues = require('./issues')(sequelize, Sequelize.DataTypes);
const Campaign = require('./campaign')(sequelize, Sequelize.DataTypes);
const DTips = require('./disasterTips')(sequelize, Sequelize.DataTypes);
const Tips = require('./tips')(sequelize, Sequelize.DataTypes);
const ContactUs = require('./contact')(sequelize, Sequelize.DataTypes);
const News = require('./news')(sequelize, Sequelize.DataTypes);
const Admin = require('./admin')(sequelize, Sequelize.DataTypes);


module.exports = {
  sequelize,
  User,
  Otp,
  Transaction,
  Notification,
  Issues,
  Campaign,
  Tips,
  DTips,
  ContactUs,
  News,
  Admin
};