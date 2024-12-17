const { Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const Otp = sequelize.define("otps", {
    id: {type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true},
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    otp_code: {
      type: DataTypes.STRING,
    },
  });

  return Otp;
};
