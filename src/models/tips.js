const { Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const Tips = sequelize.define("tips", {
    id: {type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true},
    type: {
      type: DataTypes.STRING,
      required: true
    },
    text: {
        type: DataTypes.TEXT,
        required: true
    },
    category:{
        type: DataTypes.STRING,
        required: true
    }
  });

  return Tips;
};
