const { Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define("admins", {
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
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      required: true,
      trim: true,
    },
    phone: { type: DataTypes.STRING, required: true, trim: true, unique: true },
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

  return Admin;
};
