module.exports = (sequelize, DataTypes) => {
  const File = sequelize.define("file", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imgUrl: {
      type: DataTypes.STRING,
    },
    desc: {
      type: DataTypes.TEXT,
    },
  });

  return File;
};
