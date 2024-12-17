const { Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const Issue = sequelize.define("issues", {
    id: {type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true},
    reference: {
      type: DataTypes.STRING,
      required: true
    },
    reporter: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
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
    status:{
        type: DataTypes.STRING,
        required: true,
        defaultValue: "pending"
    }
  });

  return Issue;
};
