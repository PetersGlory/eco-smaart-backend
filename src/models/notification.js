const { Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define("notifications", {
    id: {type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true},
    title: {type: DataTypes.STRING, allowNull: false, required: true, trim: true},
    contents: {type: DataTypes.STRING, required: true, trim: true},
    for_email: {type: DataTypes.STRING, required: true, trim: true},
  });

  return Notification;
};
