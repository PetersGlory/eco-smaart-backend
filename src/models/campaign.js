const { Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const Campaign = sequelize.define("campaigns", {
    id: {type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true},
    reference: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.STRING,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    goal: {
      type: DataTypes.STRING,
      required: true
    },
    description: {
        type: DataTypes.TEXT,
        required: true
    },
    img_url:{
        type: DataTypes.STRING,
        required: true
    },
    duration_date:{
        type: DataTypes.STRING,
        required: true
    },
    duration_end:{
        type: DataTypes.STRING,
        required: true
    },
    status:{
        type: DataTypes.STRING,
        required: true,
        defaultValue: "pending"
    }
  });

  return Campaign;
};
