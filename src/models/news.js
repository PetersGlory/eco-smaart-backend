const { Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const News = sequelize.define("news", {
    id: {type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true},
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    img_url: {
      type: DataTypes.STRING,
    },
    url_link: {
      type: DataTypes.STRING,
    },
    short_desc: {
      type: DataTypes.STRING,
    },
  });

  return News;
};
