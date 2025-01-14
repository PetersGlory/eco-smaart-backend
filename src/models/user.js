const { Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("users", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
      required: true,
      trim: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      required: true,
      trim: true,
    },
    profile_pics: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      required: true,
      trim: true,
    },
    phone: { type: DataTypes.STRING, required: true, trim: true, unique: true },
    referral_code: {
      type: DataTypes.STRING,
      required: true,
      trim: true,
      unique: true,
    },
    refer_by: { type: DataTypes.STRING, trim: true },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return User;
};
