const { Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define("transactions", {
    id: {type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true},
    user_id: {type: DataTypes.STRING, allowNull: false, required: true, trim: true},
    type: {type: DataTypes.STRING, allowNull: false, required: true, trim: true},
    activity_type: {type: DataTypes.STRING, required: true, trim: true},
    reference: {type: DataTypes.STRING, required: true, trim: true},
    amount: {type: DataTypes.STRING, required: true, trim: true},
    dpin: {type: DataTypes.STRING, trim: true},
    plan_type: {type: DataTypes.STRING, trim: true},
    number_to: {type: DataTypes.STRING, required: true, trim: true},
    status: {type: DataTypes.BOOLEAN, defaultValue: false},
  });

  return Transaction;
};
