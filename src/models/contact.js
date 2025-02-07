const { Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const ContactUs = sequelize.define("contactUs", {
    id: {type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true},
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false
    },
  });

  return ContactUs;
};
